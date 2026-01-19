import { useEffect, useState } from "react"
import { storage } from "@/services/storage/"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"
import {
  deleteSongWithSync,
  saveSongWithSync,
} from "@/services/sync/syncManager"

import { useAuth } from "@/modules/auth/hooks/useAuth"

export function useSongs() {
  const { user, ready } = useAuth()

  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("useSongs hook initialized")
    let mounted = true

    async function init() {
      console.log("useSongs init function running")
      try {
        let dbSongs = await storage.getSongs()

        if (!dbSongs || dbSongs.length === 0) {
          for (const s of songsData) {
            await storage.saveSong(s)
          }
          dbSongs = songsData
        }

        if (mounted) setSongs(dbSongs)
      } catch (err) {
        console.error("useSongs init error:", err)
        if (mounted) setSongs(songsData)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (!ready) {
      console.log("🎃 useSongs init: auth not ready, waiting...")
      return
    }

    setLoading(true)
    init()

    return () => {
      mounted = false
    }
  }, [ready, user])

  const addSong = async (song: Song) => {
    console.log("addSong called for song:", song)
    setLoading(true)
    try {
      await saveSongWithSync(song)
      setSongs(await storage.getSongs())
    } finally {
      setLoading(false)
    }
  }

  const updateSong = async (song: Song) => {
    console.log("updateSong called for song:", song)
    setLoading(true)
    try {
      await saveSongWithSync(song)
      setSongs(await storage.getSongs())
    } finally {
      setLoading(false)
    }
  }

  const deleteSong = async (id: string) => {
    console.log("deleteSong called for id:", id)
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
