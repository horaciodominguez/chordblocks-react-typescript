import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"

export const saveSongWithSync = async (song: Song) => {
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  await idbStorage.saveSong(song)

  if (!user) {
    await idbStorage.addPending(song)
    return
  }

  try {
    await supabaseStorage.saveSong(user.id, song)
  } catch (e) {
    await idbStorage.addPending(song)
  }
}

export const syncAll = async () => {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) return

  const pending = await idbStorage.getPending()
  for (const song of pending) {
    try {
      await supabaseStorage.saveSong(user.id, song)
    } catch (e) {
      console.error("error uploading pending song", e)
      return
    }
  }
  await idbStorage.clearPending()

  const remoteSongs = await supabaseStorage.getSongs(user.id)

  await idbStorage.clearSongs()
  for (const song of remoteSongs) {
    await idbStorage.saveSong(song)
  }
}
