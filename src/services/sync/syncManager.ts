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
  planContentMerge,
  planDuplicateGroups,
  type ContentMergePlan,
  type SongSyncConflict,
  type SongSyncConflictResolution,
} from "@/services/sync/contentIdentity"
import { remapSongIdInRepertoire } from "@/services/sync/remapSongIds"

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

async function syncRepertoires(userId: string) {
  let remote: Repertoire[]
  try {
    remote = await supabaseStorage.getRepertoires(userId)
  } catch (err) {
    console.error("getRepertoires failed (table missing?)", err)
    return
  }

  const remoteById = new Map(remote.map((r) => [r.id, r]))
  const pendingsBefore =
    (await idbStorage.getPendingRepertoires()) as PendingRepertoireDrafts[]
  const pendingSaveIds = new Set(
    pendingsBefore.filter((p) => !isPendingRepertoireDelete(p)).map((p) => p.id),
  )

  for (const p of pendingsBefore) {
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
      }

      await idbStorage.removePendingRepertoire(pendingRep.id)
    } catch (err) {
      console.error("pending repertoire sync failed", err)
    }
  }

  remote = await supabaseStorage.getRepertoires(userId)
  const local = await idbStorage.getRepertoires()
  const plan = planMembershipSync(local, remote, pendingSaveIds)

  for (const id of plan.orphanLocalIds) {
    await idbStorage.deleteRepertoire(id)
  }

  for (const rep of plan.toUpsertRemote) {
    await supabaseStorage.saveRepertoire(userId, rep)
  }

  for (const rep of plan.toWriteIdb) {
    await idbStorage.saveRepertoire(rep)
  }
}

export type SyncAllResult = {
  conflicts: SongSyncConflict[]
}

export type SyncAllOptions = {
  resolutions?: SongSyncConflictResolution[]
}

/**
 * Sync local ↔ remote with content-identity reconciliation, then LWW membership.
 * Returns user↔user conflicts that need UI resolution (seeds auto-merge).
 */
export const syncAll = async (
  options: SyncAllOptions = {},
): Promise<SyncAllResult> => {
  const userId = await getCurrentUserId()
  if (!userId) return { conflicts: [] }

  await idbStorage.prepareForUser(userId)

  let remote = await supabaseStorage.getSongs(userId)
  const resolutionById = new Map(
    (options.resolutions ?? []).map((r) => [r.conflictId, r.action]),
  )

  const pendingsForClassify = (await idbStorage.getPending()) as PendingDrafts[]
  const pendingSaves = pendingsForClassify.filter(
    (p) => !isPendingDelete(p),
  ) as Song[]

  const classification = classifyPendingByContent(pendingSaves, remote)

  for (const { local, remote: match } of classification.autoMerges) {
    await applyMergePlan(userId, planContentMerge(local, match))
  }

  const unresolved: SongSyncConflict[] = []
  for (const conflict of classification.userConflicts) {
    const action = resolutionById.get(conflict.id)
    if (action === "keepNewest") {
      await applyMergePlan(
        userId,
        planContentMerge(conflict.songA, conflict.songB),
      )
    } else if (action === "keepBoth") {
      // leave pending — flush uploads as a distinct song
    } else {
      unresolved.push(conflict)
    }
  }

  const holdIds = new Set(
    unresolved
      .filter((c) => c.source === "pending_vs_remote")
      .map((c) => c.songA.id),
  )

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
      }

      await idbStorage.removePending(pendingSong.id)
    } catch (err) {
      console.error("pending sync failed", err)
    }
  }

  remote = await supabaseStorage.getSongs(userId)

  let local = await idbStorage.getSongs()
  if (local.length === 0 && remote.length === 0) {
    local = await seedIfRemoteAlsoEmpty(remote)
    const seedPendings = (await idbStorage.getPending()) as PendingDrafts[]
    for (const p of seedPendings) {
      if (isPendingDelete(p)) continue
      try {
        await supabaseStorage.saveSong(userId, p as Song)
        await idbStorage.removePending(p.id)
        pendingSaveIds.add(p.id)
      } catch (err) {
        console.error("seed pending upload failed", err)
      }
    }
    remote = await supabaseStorage.getSongs(userId)
    local = await idbStorage.getSongs()
  }

  const plan = planMembershipSync(local, remote, pendingSaveIds, holdIds)

  for (const id of plan.orphanLocalIds) {
    await idbStorage.deleteSong(id)
  }

  for (const song of plan.toUpsertRemote) {
    await supabaseStorage.saveSong(userId, song)
  }

  for (const song of plan.toWriteIdb) {
    await idbStorage.saveSong(song)
  }

  // Post-membership content dedupe
  local = await idbStorage.getSongs()
  const dedupe = planDuplicateGroups(local)

  for (const merge of dedupe.autoMerges) {
    await applyMergePlan(userId, merge)
  }

  for (const conflict of dedupe.userConflicts) {
    const action = resolutionById.get(conflict.id)
    if (action === "keepNewest") {
      await applyMergePlan(
        userId,
        planContentMerge(conflict.songA, conflict.songB),
      )
    } else if (action === "keepBoth") {
      // keep both ids as-is
    } else {
      unresolved.push(conflict)
    }
  }

  await syncRepertoires(userId)

  return { conflicts: dedupeConflicts(unresolved) }
}

/** Apply UI resolutions and re-run sync. */
export const resolveSyncConflicts = async (
  resolutions: SongSyncConflictResolution[],
): Promise<SyncAllResult> => {
  return syncAll({ resolutions })
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
