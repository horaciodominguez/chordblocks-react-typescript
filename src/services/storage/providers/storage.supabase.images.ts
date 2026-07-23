import { supabase } from "@/services/supabaseClient"

function extensionFromMime(mime: string): string {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg"
  if (mime.includes("webp")) return "webp"
  if (mime.includes("gif")) return "gif"
  return "png"
}

export async function uploadSongImage(
  userId: string,
  songId: string,
  imageBase64: string,
): Promise<string> {
  const res = await fetch(imageBase64)
  const blob = await res.blob()
  const ext = extensionFromMime(blob.type || "image/png")
  const path = `${userId}/${songId}.${ext}`

  const { error } = await supabase.storage
    .from("song-images")
    .upload(path, blob, {
      upsert: true,
      contentType: blob.type || "image/png",
    })

  if (error) throw error

  const { data } = supabase.storage.from("song-images").getPublicUrl(path)
  return data.publicUrl
}

/** Best-effort delete of common image extensions for a song. */
export async function deleteSongImage(
  userId: string,
  songId: string,
): Promise<void> {
  const paths = ["png", "jpg", "jpeg", "webp", "gif"].map(
    (ext) => `${userId}/${songId}.${ext}`,
  )
  await supabase.storage.from("song-images").remove(paths)
}
