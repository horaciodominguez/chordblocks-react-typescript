import { supabase } from "@/services/supabaseClient"
import type { Song } from "@/modules/songs/types/song.types"
import type { StorageProvider } from "../types/storage.types"

export const supabaseStorage: StorageProvider = {
  async getSongs(): Promise<Song[]> {
    const { data: songs, error } = await supabase.from("songs").select("*")
    if (error) {
      throw new Error(error.message)
    }
    return songs
  },
  async getSong(id: string): Promise<Song | null> {
    const { data: song, error } = await supabase
      .from("songs")
      .select("*")
      .eq("id", id)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return song
  },
  async saveSong(song: Song): Promise<void> {
    const { error } = await supabase.from("songs").insert([song])
    if (error) {
      throw new Error(error.message)
    }
  },
  async updateSong(song: Song): Promise<void> {
    const { error } = await supabase
      .from("songs")
      .update({ ...song })
      .eq("id", song.id)
    if (error) {
      throw new Error(error.message)
    }
  },
  async deleteSong(id: string): Promise<void> {
    const { error } = await supabase.from("songs").delete().eq("id", id)
    if (error) {
      throw new Error(error.message)
    }
  },
}
