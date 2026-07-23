import type { Song } from "@/modules/songs/types/song.types"
import { songContentKey } from "@/modules/io/utils/normalizeTitle"
import { isNewer } from "@/services/sync/membership"

/** Only explicit catalog clones — never infer seed from title+artist alone. */
export function isSeedRelated(song: Song): boolean {
  return Boolean(song.seedOriginId)
}

export type ConflictAction = "keepNewest" | "keepBoth" | "keepLocal"

export type SongSyncConflict = {
  id: string
  songA: Song
  songB: Song
  /** pending local vs cloud, or two cloud/local duplicates already present */
  source: "pending_vs_remote" | "duplicate_group"
}

export type SongSyncConflictResolution = {
  conflictId: string
  action: ConflictAction
}

export type ContentMergePlan = {
  /** Cloud-stable id to keep */
  keeperId: string
  /** Local/other id to discard (may equal keeperId if already aligned) */
  discardId: string
  /** Winning song payload with keeperId */
  winner: Song
  /** True when winner content must be upserted to remote */
  upsertRemote: boolean
}

export type PendingClassification = {
  /** Pending songs with no content match — upload as new */
  unmatchedPending: Song[]
  /** Seed-related matches — auto LWW merge */
  autoMerges: Array<{ local: Song; remote: Song }>
  /** User↔user matches — need dialog */
  userConflicts: SongSyncConflict[]
}

export type DuplicateGroupPlan = {
  autoMerges: ContentMergePlan[]
  userConflicts: SongSyncConflict[]
}

function conflictId(a: Song, b: Song): string {
  return [a.id, b.id].sort().join("::")
}

function findRemoteMatch(local: Song, remote: Song[]): Song | undefined {
  if (local.seedOriginId) {
    const byOrigin = remote.find(
      (r) =>
        r.seedOriginId === local.seedOriginId || r.id === local.seedOriginId,
    )
    if (byOrigin) return byOrigin
  }

  const key = songContentKey(local)
  const byKey = remote.filter((r) => songContentKey(r) === key)
  if (byKey.length === 0) return undefined
  if (byKey.length === 1) return byKey[0]

  // Prefer seed-related, then newest
  return [...byKey].sort((a, b) => {
    const seedDiff = Number(isSeedRelated(b)) - Number(isSeedRelated(a))
    if (seedDiff !== 0) return seedDiff
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })[0]
}

/**
 * Plan LWW merge into remote's id (cloud-stable keeper).
 * Tie on updatedAt → remote content wins.
 */
export function planContentMerge(local: Song, remote: Song): ContentMergePlan {
  const localWins = isNewer(local, remote)
  const content = localWins ? local : remote
  const winner: Song = {
    ...content,
    id: remote.id,
    seedOriginId:
      content.seedOriginId ??
      remote.seedOriginId ??
      local.seedOriginId ??
      undefined,
    createdAt: remote.createdAt || local.createdAt || content.createdAt,
  }

  return {
    keeperId: remote.id,
    discardId: local.id,
    winner,
    upsertRemote: localWins,
  }
}

/**
 * Classify pending saves whose id is not already on remote.
 */
export function classifyPendingByContent(
  pendingSaves: Song[],
  remote: Song[],
): PendingClassification {
  const remoteIds = new Set(remote.map((r) => r.id))
  const unmatchedPending: Song[] = []
  const autoMerges: Array<{ local: Song; remote: Song }> = []
  const userConflicts: SongSyncConflict[] = []

  for (const local of pendingSaves) {
    if (remoteIds.has(local.id)) continue

    const match = findRemoteMatch(local, remote)
    if (!match) {
      unmatchedPending.push(local)
      continue
    }

    if (isSeedRelated(local) || isSeedRelated(match)) {
      autoMerges.push({ local, remote: match })
    } else {
      userConflicts.push({
        id: conflictId(local, match),
        songA: local,
        songB: match,
        source: "pending_vs_remote",
      })
    }
  }

  return { unmatchedPending, autoMerges, userConflicts }
}

/**
 * Dedupe songs that already share title+artist (post-membership cleanup).
 * - All seed-related → auto LWW into newest id
 * - Mixed seed + user → auto into newest non-seed (or newest if all mixed oddly)
 * - ≥2 non-seed → user conflicts (each extra vs newest keeper)
 */
export function planDuplicateGroups(songs: Song[]): DuplicateGroupPlan {
  const byKey = new Map<string, Song[]>()
  for (const s of songs) {
    const key = songContentKey(s)
    const list = byKey.get(key) ?? []
    list.push(s)
    byKey.set(key, list)
  }

  const autoMerges: ContentMergePlan[] = []
  const userConflicts: SongSyncConflict[] = []
  const seenConflict = new Set<string>()

  for (const group of byKey.values()) {
    if (group.length < 2) continue

    const sorted = [...group].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    const nonSeed = sorted.filter((s) => !isSeedRelated(s))
    const allSeed = nonSeed.length === 0

    if (allSeed || nonSeed.length <= 1) {
      // Auto: keeper = newest overall if all seed; else newest non-seed
      const keeper = nonSeed.length === 1 ? nonSeed[0] : sorted[0]
      for (const other of sorted) {
        if (other.id === keeper.id) continue
        // Treat "other" as local side of planContentMerge so keeper id is preserved
        autoMerges.push(planContentMerge(other, keeper))
      }
      continue
    }

    // ≥2 user songs: conflict each older non-seed against newest non-seed
    const keeper = nonSeed[0]
    for (const other of nonSeed.slice(1)) {
      const id = conflictId(other, keeper)
      if (seenConflict.has(id)) continue
      seenConflict.add(id)
      userConflicts.push({
        id,
        songA: other,
        songB: keeper,
        source: "duplicate_group",
      })
    }
    // Seed siblings in a mixed group: auto-merge into keeper
    for (const other of sorted) {
      if (other.id === keeper.id) continue
      if (!isSeedRelated(other)) continue
      autoMerges.push(planContentMerge(other, keeper))
    }
  }

  return { autoMerges, userConflicts }
}

/**
 * Pending saves that share an id with remote but are not newer (remote wins LWW).
 * Must not silently drop the pending — surface as user conflicts.
 */
export function classifyPendingLwwConflicts(
  pendingSaves: Song[],
  remote: Song[],
): SongSyncConflict[] {
  const remoteById = new Map(remote.map((r) => [r.id, r]))
  const conflicts: SongSyncConflict[] = []

  for (const local of pendingSaves) {
    const match = remoteById.get(local.id)
    if (!match) continue
    if (isNewer(local, match)) continue

    conflicts.push({
      id: conflictId(local, match),
      songA: local,
      songB: match,
      source: "pending_vs_remote",
    })
  }

  return conflicts
}

/**
 * Force local content onto the cloud-stable id (explicit “keep this device”).
 */
export function planKeepLocalMerge(
  local: Song,
  remote: Song,
): ContentMergePlan {
  const winner: Song = {
    ...local,
    id: remote.id,
    seedOriginId: local.seedOriginId ?? remote.seedOriginId ?? undefined,
    createdAt: remote.createdAt || local.createdAt,
    updatedAt: local.updatedAt,
  }

  return {
    keeperId: remote.id,
    discardId: local.id,
    winner,
    upsertRemote: true,
  }
}

/**
 * Build merge plan from a resolved conflict (keepNewest).
 * songA is treated as the discardable side when ids differ; keeper prefers songB
 * if it looks like the cloud copy (duplicate_group / pending uses B as remote).
 */
export function planResolutionMerge(
  conflict: SongSyncConflict,
  action: ConflictAction,
): ContentMergePlan | null {
  if (action === "keepBoth") return null
  if (action === "keepLocal") {
    return planKeepLocalMerge(conflict.songA, conflict.songB)
  }
  return planContentMerge(conflict.songA, conflict.songB)
}
