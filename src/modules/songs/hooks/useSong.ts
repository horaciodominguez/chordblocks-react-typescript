import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"

export function useSong(id: string | undefined) {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      if (!id) return
      setLoading(true)
      const found = await storage.getSong(id)
      setSong(found ?? null)
      setLoading(false)
    }
    load()
  }, [id])

  return { song, setSong, loading }
}
