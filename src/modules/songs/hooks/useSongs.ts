import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"
import { saveSongWithSync } from "@/services/sync/syncManager"

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
    console.log("useSongs deleteSong:", id)
    await storage.deleteSong(id)
    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  return { songs, setSongs, loading, addSong, updateSong, deleteSong }
}
