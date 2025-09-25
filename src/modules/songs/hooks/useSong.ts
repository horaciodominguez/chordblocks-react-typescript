// useSong.ts
import { useSongs } from "./useSongs"

export function useSong(id: string | undefined) {
  const { songs, loading } = useSongs()

  const song = id ? songs.find((s) => s.id === id) : undefined

  return { song, loading }
}
