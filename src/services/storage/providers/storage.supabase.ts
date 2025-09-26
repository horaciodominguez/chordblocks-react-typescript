import { supabase } from "@/services/supabaseClient"
import type { Song } from "@/modules/songs/types/song.types"

export const supabaseStorage = {
  getSongs: async (userId: string): Promise<Song[]> => {
    const { data, error } = await supabase
      .from("songs")
      .select("data")
      .eq("user_id", userId)

    if (error) throw error
    return (data || []).map((row: any) => row.data as Song)
  },

  saveSong: async (userId: string, song: Song): Promise<void> => {
    const now = new Date().toISOString()
    song.updatedAt = now
    song.createdAt = song.createdAt ?? now

    const { error } = await supabase.from("songs").upsert(
      {
        id: song.id,
        user_id: userId,
        data: song,
        created_at: song.createdAt,
        updated_at: song.updatedAt,
      },
      { onConflict: "id" }
    )

    if (error) throw error
  },

  getSong: async (userId: string, id: string): Promise<Song> => {
    const { data, error } = await supabase
      .from("songs")
      .select("data")
      .eq("user_id", userId)
      .eq("id", id)
      .single()

    if (error) throw error
    return data?.data as Song
  },

  deleteSong: async (userId: string, id: string) => {
    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("user_id", userId)
      .eq("id", id)

    if (error) throw error
  },
}
