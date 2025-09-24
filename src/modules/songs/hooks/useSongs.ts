import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"

export function useSongs() {
  console.log("useSongs")
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      console.log("useSongs init:")
      let dbSongs = await storage.getSongs()
      console.log("useSongs dbSongs:", dbSongs)
      console.log("if dbSongs.length === 0")
      if (dbSongs.length === 0) {
        console.log("useSongs dbSongs.length = 0")
        console.log("useSongs loading data")
        for (const s of songsData) {
          await storage.saveSong(s)
          await storage.addPending(s)
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
