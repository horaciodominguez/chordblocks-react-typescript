import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"
import type { PendingDrafts } from "@/services/storage/types/storage.types"

/**
 * @description Helper to get user id from supabase auth
 * @returns user id
 * --
 * Helper para obtener userId actual desde supabase auth
 */
async function getCurrentUserId(): Promise<string | null> {
  console.log("🙍‍♂️ syncManager.ts  getCurrentUserId called")
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user?.id ?? null
  } catch (err) {
    console.error("getCurrentUserId error:", err)
    return null
  }
}

/**
 * @description Try to sync a song with Supabase.
 * If it fails, leave it in pending (idb pending store).
 * @param userId
 * @param song
 * @returns void
 * --
 * Intenta sincronizar una canción concreta con Supabase.
 * Si falla, la deja en pending (idb pending store).
 */

export const syncSong = async (userId: string, song: Song) => {
  console.log("syncSong called for song:", song)
  try {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.removePending(song.id)
  } catch (error) {
    await idbStorage.addPending(song)
  }
}

/**
 * @description Save song locally (idb) and then try to sync it with Supabase.
 * If it fails, mark it as pending.
 * @param song
 * @returns void
 * --
 * Guarda localmente siempre (idb) y luego intenta subir a Supabase si hay usuario.
 * Si no hay usuario o falla, marca la canción como pending.
 */

export const saveSongWithSync = async (song: Song) => {
  console.log("🎇 saveSongWithSync called for song:", song)
  await idbStorage.saveSong(song)

  const userId = await getCurrentUserId()

  if (!userId) {
    await idbStorage.addPending(song)
    return
  }

  try {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.removePending(song.id)
  } catch (error) {
    console.error("saveSongWithSync error:", error)
    await idbStorage.addPending(song)
  }
}

/**
 * @description Delete song locally (idb) and then try to sync it with Supabase.
 * If it fails, mark it as pending.
 * @param songId
 * @returns void
 * --
 * Elimina localmente siempre (idb) y luego intenta borrar en Supabase si hay usuario.
 * Si no hay usuario o falla, marca la canción como pending.
 */

export const deleteSongWithSync = async (songId: string) => {
  console.log("🧧 deleteSongWithSync called for songId:", songId)
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
 * @description Try to sync all songs with Supabase.
 * @returns void
 * --
 * Intenta sincronizar todas las canciones con Supabase.
 */

export const syncAll = async () => {
  console.log("🛵 syncAll called")

  const userId = await getCurrentUserId()
  if (!userId) return

  // upload pending changes first
  const pendings = (await idbStorage.getPending()) as PendingDrafts[]

  for (const p of pendings) {
    try {
      if ("_action" in p && p._action === "delete") {
        await supabaseStorage.deleteSong(userId, p.id)
      } else {
        await supabaseStorage.saveSong(userId, p as Song)
      }
      await idbStorage.removePending(p.id)
    } catch (err) {
      console.error("pending sync failed", err)
    }
  }

  // Merge local and remote
  const local = await idbStorage.getSongs()
  const remote = await supabaseStorage.getSongs(userId)

  const map = new Map<string, Song>()

  for (const r of remote) map.set(r.id, r)

  for (const l of local) {
    const r = map.get(l.id)
    if (!r || new Date(l.updatedAt) > new Date(r.updatedAt)) {
      map.set(l.id, l)
      console.log("syncAll: local song is newer, adding to sync:", l)
    } else {
      console.log("syncAll: remote song is newer, keeping remote:", r)
    }
  }

  // Upload merged songs to Supabase and save to idb
  for (const song of map.values()) {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.saveSong(song)
  }

  await idbStorage.clearPending()
}
