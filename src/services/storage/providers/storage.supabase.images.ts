import { supabase } from "@/services/supabaseClient"

export async function uploadSongImage(
  userId: string,
  songId: string,
  imageBase64: string
): Promise<string> {
  const res = await fetch(imageBase64)
  const blob = await res.blob()

  const path = `${userId}/${songId}.png`

  const { error } = await supabase.storage
    .from("song-images")
    .upload(path, blob, {
      upsert: true,
      contentType: "image/png",
    })

  if (error) throw error

  const { data } = supabase.storage.from("song-images").getPublicUrl(path)

  return data.publicUrl
}
