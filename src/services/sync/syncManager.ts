import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import {
  isPendingDelete,
  type PendingDrafts,
} from "@/services/storage/types/storage.types"
import {
  isPendingRepertoireDelete,
  type PendingRepertoireDrafts,
} from "@/modules/repertoires/types/pending.types"
import { seedIfRemoteAlsoEmpty } from "@/modules/songs/utils/seedLocalSongs"
import { isNewer, planMembershipSync } from "@/services/sync/membership"
import { touchRepertoire } from "@/modules/repertoires/utils/repertoire.factory"
import {
  classifyPendingByContent,
  classifyPendingLwwConflicts,
  planContentMerge,
  planDuplicateGroups,
  planKeepLocalMerge,
  type ContentMergePlan,
  type SongSyncConflict,
  type SongSyncConflictResolution,
} from "@/services/sync/contentIdentity"
import { remapSongIdInRepertoire, removeSongIdsFromRepertoire } from "@/services/sync/remapSongIds"
import { throwIfAborted } from "@/services/sync/abort"
import { v4 as uuidv4 } from "uuid"

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user?.id ?? null
  } catch (err) {
    console.error("getCurrentUserId error:", err)
    return null
  }
}

/**
 * Stamp updatedAt before a user-driven persist (create/update).
 */
export function touchSong(song: Song): Song {
  return {
    ...song,
    updatedAt: new Date().toISOString(),
    createdAt: song.createdAt || new Date().toISOString(),
  }
}

export const syncSong = async (userId: string, song: Song) => {
  try {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.removePending(song.id)
  } catch {
    await idbStorage.addPending(song)
  }
}

export const saveSongWithSync = async (song: Song) => {
  const toSave = touchSong(song)
  await idbStorage.saveSong(toSave)

  const userId = await getCurrentUserId()

  if (!userId) {
    await idbStorage.addPending(toSave)
    return
  }

  try {
    await supabaseStorage.saveSong(userId, toSave)
    await idbStorage.removePending(toSave.id)
  } catch (error) {
    console.error("saveSongWithSync error:", error)
    await idbStorage.addPending(toSave)
  }
}

export const deleteSongWithSync = async (songId: string) => {
  await cascadeRemoveSongIdsFromRepertoires([songId])
  await idbStorage.deleteSong(songId)

  const userId = await getCurrentUserId()

  if (!userId) {
    await idbStorage.addPendingDelete(songId)
    return
  }

  try {
    await supabaseStorage.deleteSong(userId, songId)
    await idbStorage.removePending(songId)
  } catch (error) {
    console.error("deleteSongWithSync error:", error)
    await idbStorage.addPendingDelete(songId)
  }
}

export const saveRepertoireWithSync = async (rep: Repertoire) => {
  const toSave = touchRepertoire(rep)
  await idbStorage.saveRepertoire(toSave)

  const userId = await getCurrentUserId()

  if (!userId) {
    await idbStorage.addPendingRepertoire(toSave)
    return
  }

  try {
    await supabaseStorage.saveRepertoire(userId, toSave)
    await idbStorage.removePendingRepertoire(toSave.id)
  } catch (error) {
    console.error("saveRepertoireWithSync error:", error)
    await idbStorage.addPendingRepertoire(toSave)
  }
}

export const deleteRepertoireWithSync = async (repertoireId: string) => {
  await idbStorage.deleteRepertoire(repertoireId)

  const userId = await getCurrentUserId()

  if (!userId) {
    await idbStorage.addPendingRepertoireDelete(repertoireId)
    return
  }

  try {
    await supabaseStorage.deleteRepertoire(userId, repertoireId)
    await idbStorage.removePendingRepertoire(repertoireId)
  } catch (error) {
    console.error("deleteRepertoireWithSync error:", error)
    await idbStorage.addPendingRepertoireDelete(repertoireId)
  }
}

async function remapSongIdsEverywhere(fromId: string, toId: string) {
  if (fromId === toId) return

  const reps = await idbStorage.getRepertoires()
  for (const rep of reps) {
    const next = remapSongIdInRepertoire(rep, fromId, toId)
    if (next === rep) continue
    await idbStorage.saveRepertoire(next)
    await idbStorage.addPendingRepertoire(next)
  }

  const pendingReps =
    (await idbStorage.getPendingRepertoires()) as PendingRepertoireDrafts[]
  for (const p of pendingReps) {
    if (isPendingRepertoireDelete(p)) continue
    const next = remapSongIdInRepertoire(p as Repertoire, fromId, toId)
    if (next === p) continue
    await idbStorage.addPendingRepertoire(next)
  }
}

/** Strip song refs from all sets (saved + pending) so deletes do not leave Missing song. */
export async function cascadeRemoveSongIdsFromRepertoires(
  songIds: string[],
): Promise<number> {
  if (songIds.length === 0) return 0
  const idSet = new Set(songIds)
  let touched = 0

  const reps = await idbStorage.getRepertoires()
  for (const rep of reps) {
    const next = removeSongIdsFromRepertoire(rep, idSet)
    if (next === rep) continue
    await idbStorage.saveRepertoire(next)
    await idbStorage.addPendingRepertoire(next)
    touched += 1
  }

  const pendingReps =
    (await idbStorage.getPendingRepertoires()) as PendingRepertoireDrafts[]
  for (const p of pendingReps) {
    if (isPendingRepertoireDelete(p)) continue
    const next = removeSongIdsFromRepertoire(p as Repertoire, idSet)
    if (next === p) continue
    await idbStorage.addPendingRepertoire(next)
    touched += 1
  }

  return touched
}

async function applyMergePlan(
  userId: string,
  plan: ContentMergePlan,
): Promise<void> {
  const { keeperId, discardId, winner, upsertRemote } = plan

  if (discardId !== keeperId) {
    await remapSongIdsEverywhere(discardId, keeperId)
    await idbStorage.deleteSong(discardId)
    await idbStorage.removePending(discardId)
    try {
      await supabaseStorage.deleteSong(userId, discardId)
    } catch {
      /* discard may not exist remotely */
    }
  }

  await idbStorage.saveSong(winner)
  await idbStorage.removePending(keeperId)

  if (upsertRemote) {
    try {
      await supabaseStorage.saveSong(userId, winner)
    } catch (err) {
      console.error("applyMergePlan upsert failed", err)
      await idbStorage.addPending(winner)
    }
  }
}

/**
 * Keep remote on the shared id and fork the offline pending edit as a new song.
 */
async function keepBothSameId(
  userId: string,
  local: Song,
  remote: Song,
): Promise<void> {
  const clone: Song = {
    ...local,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await idbStorage.saveSong(remote)
  await idbStorage.removePending(local.id)
  await idbStorage.saveSong(clone)
  await idbStorage.addPending(clone)

  try {
    await supabaseStorage.saveSong(userId, clone)
    await idbStorage.removePending(clone.id)
  } catch (err) {
    console.error("keepBothSameId upload failed", err)
  }
}

async function applyConflictAction(
  userId: string,
  conflict: SongSyncConflict,
  action: SongSyncConflictResolution["action"],
): Promise<void> {
  if (action === "keepNewest") {
    await applyMergePlan(
      userId,
      planContentMerge(conflict.songA, conflict.songB),
    )
    return
  }
  if (action === "keepLocal") {
    await applyMergePlan(
      userId,
      planKeepLocalMerge(conflict.songA, conflict.songB),
    )
    return
  }
  // keepBoth
  if (conflict.songA.id === conflict.songB.id) {
    await keepBothSameId(userId, conflict.songA, conflict.songB)
  }
  // Different ids: leave pending so flush uploads songA as its own chart
}

function dedupeConflicts(conflicts: SongSyncConflict[]): SongSyncConflict[] {
  const seen = new Set<string>()
  const out: SongSyncConflict[] = []
  for (const c of conflicts) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    out.push(c)
  }
  return out
}

async function syncRepertoires(
  userId: string,
  signal?: AbortSignal,
): Promise<Repertoire[]> {
  throwIfAborted(signal)

  let remote: Repertoire[]
  try {
    remote = await supabaseStorage.getRepertoires(userId)
  } catch (err) {
    console.error("getRepertoires failed (table missing?)", err)
    return []
  }

  throwIfAborted(signal)

  const remoteById = new Map(remote.map((r) => [r.id, r]))
  const pendingsBefore =
    (await idbStorage.getPendingRepertoires()) as PendingRepertoireDrafts[]
  const pendingSaveIds = new Set(
    pendingsBefore.filter((p) => !isPendingRepertoireDelete(p)).map((p) => p.id),
  )

  for (const p of pendingsBefore) {
    throwIfAborted(signal)
    try {
      if (isPendingRepertoireDelete(p)) {
        await supabaseStorage.deleteRepertoire(userId, p.id)
        await idbStorage.removePendingRepertoire(p.id)
        remoteById.delete(p.id)
        continue
      }

      const pendingRep = p as Repertoire
      const remoteRep = remoteById.get(pendingRep.id)

      if (!remoteRep || isNewer(pendingRep, remoteRep)) {
        await supabaseStorage.saveRepertoire(userId, pendingRep)
        remoteById.set(pendingRep.id, pendingRep)
        await idbStorage.removePendingRepertoire(pendingRep.id)
      }
      // Remote newer/equal: keep pending until local is newer (no silent discard).
    } catch (err) {
      throwIfAborted(signal)
      console.error("pending repertoire sync failed", err)
    }
  }

  throwIfAborted(signal)
  remote = await supabaseStorage.getRepertoires(userId)
  const local = await idbStorage.getRepertoires()
  const plan = planMembershipSync(local, remote, pendingSaveIds)

  // Do NOT delete orphan sets here — UI must confirm first.
  const localById = new Map(local.map((r) => [r.id, r]))
  const orphanRepertoires = plan.orphanLocalIds
    .map((id) => localById.get(id))
    .filter((r): r is Repertoire => Boolean(r))

  for (const rep of plan.toUpsertRemote) {
    throwIfAborted(signal)
    await supabaseStorage.saveRepertoire(userId, rep)
  }

  for (const rep of plan.toWriteIdb) {
    throwIfAborted(signal)
    await idbStorage.saveRepertoire(rep)
  }

  return orphanRepertoires
}

export type SyncAllResult = {
  conflicts: SongSyncConflict[]
  /** Local-only songs not on cloud — awaiting user confirm before purge */
  orphanSongs: Song[]
  /** Local-only sets not on cloud — awaiting user confirm before purge */
  orphanRepertoires: Repertoire[]
}

export type SyncAllOptions = {
  resolutions?: SongSyncConflictResolution[]
  /** When aborted, sync stops at the next cooperative checkpoint (no overlapping writes). */
  signal?: AbortSignal
}

export type OrphanResolutionAction = "delete" | "keep"

/**
 * Sync local ↔ remote with content-identity reconciliation, then LWW membership.
 * Returns user↔user conflicts that need UI resolution (seeds auto-merge).
 */
export const syncAll = async (
  options: SyncAllOptions = {},
): Promise<SyncAllResult> => {
  const { signal } = options
  throwIfAborted(signal)

  const userId = await getCurrentUserId()
  if (!userId) return { conflicts: [], orphanSongs: [], orphanRepertoires: [] }

  throwIfAborted(signal)
  await idbStorage.prepareForUser(userId)

  throwIfAborted(signal)
  let remote = await supabaseStorage.getSongs(userId)
  const resolutionById = new Map(
    (options.resolutions ?? []).map((r) => [r.conflictId, r.action]),
  )

  const pendingsForClassify = (await idbStorage.getPending()) as PendingDrafts[]
  const pendingSaves = pendingsForClassify.filter(
    (p) => !isPendingDelete(p),
  ) as Song[]

  const classification = classifyPendingByContent(pendingSaves, remote)
  const lwwConflicts = classifyPendingLwwConflicts(pendingSaves, remote)

  for (const { local, remote: match } of classification.autoMerges) {
    throwIfAborted(signal)
    await applyMergePlan(userId, planContentMerge(local, match))
  }

  const unresolved: SongSyncConflict[] = []
  const seenConflictIds = new Set<string>()

  for (const conflict of [
    ...classification.userConflicts,
    ...lwwConflicts,
  ]) {
    throwIfAborted(signal)
    if (seenConflictIds.has(conflict.id)) continue
    seenConflictIds.add(conflict.id)

    const action = resolutionById.get(conflict.id)
    if (action) {
      await applyConflictAction(userId, conflict, action)
    } else {
      unresolved.push(conflict)
    }
  }

  const holdIds = new Set(
    unresolved
      .filter((c) => c.source === "pending_vs_remote")
      .map((c) => c.songA.id),
  )

  throwIfAborted(signal)
  remote = await supabaseStorage.getSongs(userId)
  const remoteById = new Map(remote.map((r) => [r.id, r]))

  const pendingsBefore = (await idbStorage.getPending()) as PendingDrafts[]
  const pendingSaveIds = new Set(
    pendingsBefore
      .filter((p) => !isPendingDelete(p))
      .map((p) => p.id)
      .filter((id) => !holdIds.has(id)),
  )

  for (const p of pendingsBefore) {
    throwIfAborted(signal)
    try {
      if (isPendingDelete(p)) {
        await supabaseStorage.deleteSong(userId, p.id)
        await idbStorage.removePending(p.id)
        remoteById.delete(p.id)
        continue
      }

      if (holdIds.has(p.id)) continue

      const pendingSong = p as Song
      const remoteSong = remoteById.get(pendingSong.id)

      if (!remoteSong || isNewer(pendingSong, remoteSong)) {
        await supabaseStorage.saveSong(userId, pendingSong)
        remoteById.set(pendingSong.id, pendingSong)
        await idbStorage.removePending(pendingSong.id)
      } else {
        // Safety net: remote wins LWW — never drop pending without a resolution.
        const conflict: SongSyncConflict = {
          id: [pendingSong.id, remoteSong.id].sort().join("::"),
          songA: pendingSong,
          songB: remoteSong,
          source: "pending_vs_remote",
        }
        if (!seenConflictIds.has(conflict.id)) {
          seenConflictIds.add(conflict.id)
          unresolved.push(conflict)
          holdIds.add(pendingSong.id)
          pendingSaveIds.delete(pendingSong.id)
        }
      }
    } catch (err) {
      throwIfAborted(signal)
      console.error("pending sync failed", err)
    }
  }

  throwIfAborted(signal)
  remote = await supabaseStorage.getSongs(userId)

  let local = await idbStorage.getSongs()
  if (local.length === 0 && remote.length === 0) {
    throwIfAborted(signal)
    local = await seedIfRemoteAlsoEmpty(remote)
    const seedPendings = (await idbStorage.getPending()) as PendingDrafts[]
    for (const p of seedPendings) {
      throwIfAborted(signal)
      if (isPendingDelete(p)) continue
      try {
        await supabaseStorage.saveSong(userId, p as Song)
        await idbStorage.removePending(p.id)
        pendingSaveIds.add(p.id)
      } catch (err) {
        throwIfAborted(signal)
        console.error("seed pending upload failed", err)
      }
    }
    throwIfAborted(signal)
    remote = await supabaseStorage.getSongs(userId)
    local = await idbStorage.getSongs()
  }

  throwIfAborted(signal)
  const plan = planMembershipSync(local, remote, pendingSaveIds, holdIds)

  // Do NOT delete orphan songs here — UI must confirm first (S0.6).
  const localById = new Map(local.map((s) => [s.id, s]))
  const orphanSongs = plan.orphanLocalIds
    .map((id) => localById.get(id))
    .filter((s): s is Song => Boolean(s))

  for (const song of plan.toUpsertRemote) {
    throwIfAborted(signal)
    await supabaseStorage.saveSong(userId, song)
  }

  for (const song of plan.toWriteIdb) {
    throwIfAborted(signal)
    await idbStorage.saveSong(song)
  }

  // Post-membership content dedupe
  throwIfAborted(signal)
  local = await idbStorage.getSongs()
  const dedupe = planDuplicateGroups(local)

  for (const merge of dedupe.autoMerges) {
    throwIfAborted(signal)
    await applyMergePlan(userId, merge)
  }

  for (const conflict of dedupe.userConflicts) {
    throwIfAborted(signal)
    if (seenConflictIds.has(conflict.id)) continue
    seenConflictIds.add(conflict.id)

    const action = resolutionById.get(conflict.id)
    if (action) {
      await applyConflictAction(userId, conflict, action)
    } else {
      unresolved.push(conflict)
    }
  }

  const orphanRepertoires = await syncRepertoires(userId, signal)

  return {
    conflicts: dedupeConflicts(unresolved),
    orphanSongs,
    orphanRepertoires,
  }
}

/** Apply UI resolutions and re-run sync. */
export const resolveSyncConflicts = async (
  resolutions: SongSyncConflictResolution[],
  signal?: AbortSignal,
): Promise<SyncAllResult> => {
  return syncAll({ resolutions, signal })
}

/**
 * After user confirms orphan purge/keep:
 * - delete: cascade set refs, remove local orphans
 * - keep: queue pending uploads so they rejoin the cloud
 */
export const resolveSyncOrphans = async (
  options: {
    songIds: string[]
    repertoireIds: string[]
    action: OrphanResolutionAction
    signal?: AbortSignal
  },
): Promise<SyncAllResult> => {
  const { songIds, repertoireIds, action, signal } = options
  throwIfAborted(signal)

  if (action === "delete") {
    await cascadeRemoveSongIdsFromRepertoires(songIds)
    for (const id of songIds) {
      throwIfAborted(signal)
      await idbStorage.deleteSong(id)
      await idbStorage.removePending(id)
    }
    for (const id of repertoireIds) {
      throwIfAborted(signal)
      await idbStorage.deleteRepertoire(id)
      await idbStorage.removePendingRepertoire(id)
    }
  } else {
    for (const id of songIds) {
      throwIfAborted(signal)
      const song = await idbStorage.getSong(id)
      if (song) await idbStorage.addPending(song)
    }
    for (const id of repertoireIds) {
      throwIfAborted(signal)
      const rep = (await idbStorage.getRepertoires()).find((r) => r.id === id)
      if (rep) await idbStorage.addPendingRepertoire(rep)
    }
  }

  return syncAll({ signal })
}

export const __testables = {
  isNewer,
  planMembershipSync,
  applyMergePlan,
  classifyPendingByContent,
  planContentMerge,
  planDuplicateGroups,
}

export type { SongSyncConflict, SongSyncConflictResolution }
