import { supabase } from "@/services/supabaseClient"
import type { Song } from "@/modules/songs/types/song.types"
import { uploadSongImage, deleteSongImage } from "./storage.supabase.images"

function log(...args: unknown[]) {
  if (import.meta.env.DEV) console.log(...args)
}

export const supabaseStorage = {
  getSongs: async (userId: string): Promise<Song[]> => {
    log("supabaseStorage.getSongs", userId)
    const { data, error } = await supabase
      .from("songs")
      .select("data")
      .eq("user_id", userId)

    if (error) throw error
    return (data || []).map((row: { data: Song }) => row.data)
  },

  saveSong: async (userId: string, song: Song): Promise<void> => {
    log("supabaseStorage.saveSong", userId, song.id)
    await supabase.auth.getSession()

    // Clone — never mutate caller's object
    const draft: Song = {
      ...song,
      timeSignature: { ...song.timeSignature },
      songSections: song.songSections,
    }

    const now = new Date().toISOString()
    draft.createdAt = draft.createdAt ?? now
    draft.updatedAt = draft.updatedAt ?? now

    if (draft.imageBase64) {
      const imageUrl = await uploadSongImage(
        userId,
        draft.id,
        draft.imageBase64,
      )
      draft.imageUrl = imageUrl
      draft.imageBase64 = null
    }

    const { error } = await supabase.from("songs").upsert(
      {
        id: draft.id,
        user_id: userId,
        data: draft,
        created_at: draft.createdAt,
        updated_at: draft.updatedAt,
      },
      { onConflict: "id" },
    )

    if (error) throw error
  },

  getSong: async (userId: string, id: string): Promise<Song | null> => {
    const { data, error } = await supabase
      .from("songs")
      .select("data")
      .eq("user_id", userId)
      .eq("id", id)
      .single()

    if (error) throw error
    return (data?.data as Song) ?? null
  },

  deleteSong: async (userId: string, id: string) => {
    log("supabaseStorage.deleteSong", userId, id)
    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("user_id", userId)
      .eq("id", id)

    if (error) throw error

    try {
      await deleteSongImage(userId, id)
    } catch (err) {
      if (import.meta.env.DEV) console.warn("deleteSongImage failed", err)
    }
  },
}
