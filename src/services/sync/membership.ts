import type { Song } from "@/modules/songs/types/song.types"

export function isNewer(a: Song, b: Song): boolean {
  return new Date(a.updatedAt) > new Date(b.updatedAt)
}

export type MembershipPlan = {
  toWriteIdb: Song[]
  toUpsertRemote: Song[]
  orphanLocalIds: string[]
}

/**
 * Pure membership + LWW planner (Supabase ID set is authoritative).
 * - both → LWW
 * - remote only → IDB
 * - local only + pendingSave → upsert
 * - local only without pending → orphan (purge)
 */
export function planMembershipSync(
  local: Song[],
  remote: Song[],
  pendingSaveIds: Set<string>,
): MembershipPlan {
  const remoteIds = new Set(remote.map((r) => r.id))
  const localById = new Map(local.map((l) => [l.id, l]))

  const toWriteIdb: Song[] = []
  const toUpsertRemote: Song[] = []
  const orphanLocalIds: string[] = []

  for (const r of remote) {
    const l = localById.get(r.id)
    if (l && isNewer(l, r)) {
      toWriteIdb.push(l)
      toUpsertRemote.push(l)
    } else {
      toWriteIdb.push(r)
    }
  }

  for (const l of local) {
    if (remoteIds.has(l.id)) continue
    if (pendingSaveIds.has(l.id)) {
      toWriteIdb.push(l)
      toUpsertRemote.push(l)
    } else {
      orphanLocalIds.push(l.id)
    }
  }

  return { toWriteIdb, toUpsertRemote, orphanLocalIds }
}
