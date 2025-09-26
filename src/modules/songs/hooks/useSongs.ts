import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"
import {
  deleteSongWithSync,
  saveSongWithSync,
} from "@/services/sync/syncManager"

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      let dbSongs = await storage.getSongs()
      if (dbSongs.length === 0) {
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

  const addSong = async (song: Song) => {
    await saveSongWithSync(song)
    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  const updateSong = async (song: Song) => {
    await saveSongWithSync(song)
    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  const deleteSong = async (id: string) => {
    await deleteSongWithSync(id)
    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  return { songs, setSongs, loading, addSong, updateSong, deleteSong }
}
