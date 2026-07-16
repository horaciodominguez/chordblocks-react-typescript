import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"
import {
  isPendingDelete,
  type PendingDrafts,
} from "@/services/storage/types/storage.types"
import { seedIfRemoteAlsoEmpty } from "@/modules/songs/utils/seedLocalSongs"
import { isNewer, planMembershipSync } from "@/services/sync/membership"

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

/**
 * Sync local ↔ remote with LWW + membership (Supabase wins set of IDs).
 */
export const syncAll = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return

  await idbStorage.prepareForUser(userId)

  let remote = await supabaseStorage.getSongs(userId)
  const remoteById = new Map(remote.map((r) => [r.id, r]))

  const pendingsBefore = (await idbStorage.getPending()) as PendingDrafts[]
  const pendingSaveIds = new Set(
    pendingsBefore.filter((p) => !isPendingDelete(p)).map((p) => p.id),
  )

  for (const p of pendingsBefore) {
    try {
      if (isPendingDelete(p)) {
        await supabaseStorage.deleteSong(userId, p.id)
        await idbStorage.removePending(p.id)
        remoteById.delete(p.id)
        continue
      }

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

  const plan = planMembershipSync(local, remote, pendingSaveIds)

  for (const id of plan.orphanLocalIds) {
    await idbStorage.deleteSong(id)
  }

  for (const song of plan.toUpsertRemote) {
    await supabaseStorage.saveSong(userId, song)
  }

  for (const song of plan.toWriteIdb) {
    await idbStorage.saveSong(song)
  }
}

export const __testables = { isNewer, planMembershipSync }
