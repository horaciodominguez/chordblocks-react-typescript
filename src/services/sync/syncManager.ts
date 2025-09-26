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
  const userId = await getCurrentUserId()
  if (!userId) return

  const songDrafts = (await idbStorage.getPending()) as PendingDrafts[]
  for (const songDraft of songDrafts) {
    try {
      if ("_action" in songDraft && songDraft._action === "delete") {
        await supabaseStorage.deleteSong(userId, songDraft.id)
        await idbStorage.removePending(songDraft.id)
      } else {
        await supabaseStorage.saveSong(userId, songDraft as Song)
        await idbStorage.removePending(songDraft.id)
      }
    } catch (err) {
      console.error("syncAll pending error:", err)
    }
  }

  const localSongs = await idbStorage.getSongs()
  for (const song of localSongs) {
    try {
      await supabaseStorage.saveSong(userId, song)
      await idbStorage.removePending(song.id)
    } catch (err) {
      console.error("syncAll localSongs error:", err)
      await idbStorage.addPending(song)
    }
  }
}
