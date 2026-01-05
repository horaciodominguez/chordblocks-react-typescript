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
    let mounted = true

    async function init() {
      try {
        // Load songs from supabase storage
        console.log("useSongs init: trying to load songs from storage")
        let dbSongs = await storage.getSongs()

        if (!dbSongs || dbSongs.length === 0) {
          console.log(
            "useSongs init: no songs in storage, loading default songs"
          )
          for (const s of songsData) {
            await storage.saveSong(s)
          }
          dbSongs = songsData
        } else {
          console.log("useSongs init: loaded songs from storage", dbSongs)
        }
        if (mounted) setSongs(dbSongs)
      } catch (err) {
        console.error("useSongs init error:", err)
        // Fallback to default songs in case of error
        if (mounted) setSongs(songsData)
      } finally {
        setTimeout(() => {
          if (mounted) setLoading(false)
        }, 500)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [])

  const addSong = async (song: Song) => {
    setLoading(true)
    try {
      await saveSongWithSync(song)
      setSongs(await storage.getSongs())
    } finally {
      setLoading(false)
    }
  }

  const updateSong = async (song: Song) => {
    setLoading(true)
    try {
      await saveSongWithSync(song)
      setSongs(await storage.getSongs())
    } finally {
      setLoading(false)
    }
  }

  const deleteSong = async (id: string) => {
    setLoading(true)
    try {
      await deleteSongWithSync(id)
      setSongs(await storage.getSongs())
    } finally {
      setLoading(false)
    }
  }

  return { songs, setSongs, loading, addSong, updateSong, deleteSong }
}
