import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      let dbSongs = await storage.getSongs()
      if (dbSongs.length === 0) {
        for (const s of songsData) {
          await storage.saveSong(s)
        }
        dbSongs = songsData
      }
      setSongs(dbSongs)
      setLoading(false)
    }
    init()
  }, [])

  return { songs, setSongs, loading }
}
