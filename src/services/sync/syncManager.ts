import { supabase } from "@/services/supabaseClient"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { supabaseStorage } from "@/services/storage/providers/storage.supabase"
import type { Song } from "@/modules/songs/types/song.types"

export const saveSongWithSync = async (song: Song) => {
  console.log("saveSongWithSync")
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

  // 🔹 subo pendientes (solo si más nuevo o no existe en remoto)
  const pending = await idbStorage.getPending()
  for (const song of pending) {
    await syncSong(user.id, song)
  }
  await idbStorage.clearPending()

  // 🔹 ahora bajo remoto
  const remoteSongs = await supabaseStorage.getSongs(user.id)
  const localSongs = await idbStorage.getSongs()

  // 🔹 merge de local y remoto por updatedAt
  for (const remote of remoteSongs) {
    const local = localSongs.find((s) => s.id === remote.id)
    if (!local) {
      // no existe en local → guardo remoto
      await idbStorage.saveSong(remote)
    } else if (new Date(remote.updatedAt) > new Date(local.updatedAt)) {
      // remoto más nuevo → piso local
      await idbStorage.saveSong(remote)
    }
    // si local más nuevo, ya lo subí antes (en pending o al crear)
  }

  // 🔹 canciones locales que no están en remoto → subir
  for (const local of localSongs) {
    const exists = remoteSongs.find((r) => r.id === local.id)
    if (!exists) {
      await supabaseStorage.saveSong(user.id, local)
    }
  }
}

// helper para subir comparando updatedAt
const syncSong = async (userId: string, song: Song) => {
  const remoteSongs = await supabaseStorage.getSongs(userId)
  const remote = remoteSongs.find((r) => r.id === song.id)

  if (!remote) {
    await supabaseStorage.saveSong(userId, song)
  } else if (new Date(song.updatedAt) > new Date(remote.updatedAt)) {
    await supabaseStorage.saveSong(userId, song)
  }
}
