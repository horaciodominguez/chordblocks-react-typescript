import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import { type Song } from "@/modules/songs/types/song.types"

export const syncSong = async (userId: string, song: Song) => {
  try {
    await supabaseStorage.saveSong(userId, song)
    await idbStorage.removePending(song.id)
  } catch (error) {
    await idbStorage.addPending(song)
  }
}

export const saveSongWithSync = async (song: Song) => {
  await idbStorage.saveSong(song)

  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) {
    await idbStorage.addPending(song)
    return
  }

  try {
    await supabaseStorage.saveSong(user.id, song)
    await idbStorage.removePending(song.id)
  } catch (error) {
    console.error("saveSongWithSync error:", error)
    await idbStorage.addPending(song)
  }
}

export const deleteSongWithSync = async (songId: string) => {
  await idbStorage.deleteSong(songId)

  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) {
    await idbStorage.addPendingDelete(songId)
    return
  }

  try {
    await supabaseStorage.deleteSong(user.id, songId)
    await idbStorage.removePending(songId)
  } catch (error) {
    console.error("deleteSongWithSync error:", error)
    await idbStorage.addPendingDelete(songId)
  }
}

export const syncAll = async () => {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) return

  const pending = await idbStorage.getPending()

  for (const entry of pending) {
    try {
      if ((entry as any)?._action === "delete") {
        await supabaseStorage.deleteSong(user.id, (entry as any).id)
        await idbStorage.removePending((entry as any).id)
      } else {
        await syncSong(user.id, entry as Song)
        await idbStorage.removePending((entry as Song).id)
      }
    } catch (error) {
      console.error("syncAll pending error:", error)
    }
  }

  const localSongs = await idbStorage.getSongs()
  for (const song of localSongs) {
    try {
      await syncSong(user.id, song)
    } catch (error) {
      console.error("syncAll localSongs error:", error)
    }
  }
}
