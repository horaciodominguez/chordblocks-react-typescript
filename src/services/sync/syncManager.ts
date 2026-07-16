import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"
import type { PendingDrafts } from "@/services/storage/types/storage.types"
import { seedIfRemoteAlsoEmpty } from "@/modules/songs/utils/seedLocalSongs"

/**
 * Helper to get user id from supabase auth
 */
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
 * Sync merge must NOT call this — it preserves existing timestamps for LWW.
 */
export function touchSong(song: Song): Song {
  return {
    ...song,
    updatedAt: new Date().toISOString(),
    createdAt: song.createdAt || new Date().toISOString(),
  }
}

/**
 * Try to sync a song with Supabase.
 * If it fails, leave it in pending (idb pending store).
 */
export const syncSong = async (userId: string, song: Song) => {
  try {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.removePending(song.id)
  } catch {
    await idbStorage.addPending(song)
  }
}

/**
 * Save song locally (idb) and then try to sync it with Supabase.
 * If it fails, mark it as pending.
 * Sets updatedAt for user-driven saves.
 */
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

/**
 * Delete song locally (idb) and then try to sync it with Supabase.
 * If it fails, mark it as pending delete.
 */
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

function isNewer(a: Song, b: Song): boolean {
  return new Date(a.updatedAt) > new Date(b.updatedAt)
}

/**
 * Sync local ↔ remote with LWW by updatedAt.
 *
 * Order matters:
 * 1. Pull remote first (source of truth when logged in)
 * 2. Flush pending with LWW — never upload stale seed over newer remote
 * 3. If both empty → seed mockups (new account)
 * 4. Merge and write winners to both stores
 */
export const syncAll = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return

  // 1) Remote first — so we know cloud truth before touching pending
  let remote = await supabaseStorage.getSongs(userId)
  const remoteById = new Map(remote.map((r) => [r.id, r]))

  // 2) Flush pending with LWW (stale mock seeds must not overwrite cloud)
  const pendings = (await idbStorage.getPending()) as PendingDrafts[]

  for (const p of pendings) {
    try {
      if ("_action" in p && p._action === "delete") {
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

      // Drop pending once evaluated (including discarded stale seeds)
      await idbStorage.removePending(pendingSong.id)
    } catch (err) {
      console.error("pending sync failed", err)
    }
  }

  // Refresh remote after pending pushes
  remote = await supabaseStorage.getSongs(userId)

  // 3) Brand-new account: nothing local, nothing remote → seed then continue
  let local = await idbStorage.getSongs()
  if (local.length === 0 && remote.length === 0) {
    local = await seedIfRemoteAlsoEmpty(remote)
  }

  // 4) Merge LWW
  const map = new Map<string, Song>()

  for (const r of remote) map.set(r.id, r)

  for (const l of local) {
    const r = map.get(l.id)
    if (!r || isNewer(l, r)) {
      map.set(l.id, l)
    }
  }

  // 5) Write mirror: cloud + IDB (preserve updatedAt)
  for (const song of map.values()) {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.saveSong(song)
  }

  // Drop local-only stale copies that lost to remote are already overwritten.
  // If remote had data and local was empty, map === remote → IDB hydrated from cloud.
}
