import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import type { Song } from "@/modules/songs/types/song.types"
import { songsData } from "@/modules/songs/data/songs"
import {
  deleteSongWithSync,
  saveSongWithSync,
} from "@/services/sync/syncManager"
import { useAuth } from "@/modules/auth/context/AuthContext"
import { ensureLocalSongs } from "@/modules/songs/utils/seedLocalSongs"

type SongsContextValue = {
  songs: Song[]
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
  /** True only during the first app hydration */
  initialLoading: boolean
  /** True while a mutation (add/update/delete) is in flight */
  mutating: boolean
  /** @deprecated Prefer initialLoading / mutating */
  loading: boolean
  addSong: (song: Song) => Promise<void>
  updateSong: (song: Song) => Promise<void>
  deleteSong: (id: string) => Promise<void>
  refreshSongs: () => Promise<void>
}

const SongsContext = createContext<SongsContextValue | null>(null)

export function SongsProvider({ children }: { children: ReactNode }) {
  const { user, ready, syncEpoch } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [mutating, setMutating] = useState(false)
  const initialLoadDone = useRef(false)

  const refreshSongs = useCallback(async () => {
    const dbSongs = await idbStorage.getSongs()
    setSongs(dbSongs)
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      const showFullLoader = !initialLoadDone.current
      if (showFullLoader) setInitialLoading(true)

      try {
        const dbSongs = await ensureLocalSongs({ hasSession: !!user })
        if (mounted) setSongs(dbSongs)
      } catch (err) {
        console.error("SongsProvider init error:", err)
        if (mounted) {
          try {
            setSongs(await idbStorage.getSongs())
          } catch {
            setSongs(user ? [] : songsData)
          }
        }
      } finally {
        if (mounted) {
          setInitialLoading(false)
          initialLoadDone.current = true
        }
      }
    }

    if (!ready) return

    init()

    return () => {
      mounted = false
    }
  }, [ready, user])

  useEffect(() => {
    if (!ready || !initialLoadDone.current) return
    if (syncEpoch === 0) return
    void refreshSongs()
  }, [syncEpoch, ready, refreshSongs])

  const addSong = useCallback(async (song: Song) => {
    setMutating(true)
    try {
      await saveSongWithSync(song)
      setSongs(await idbStorage.getSongs())
    } finally {
      setMutating(false)
    }
  }, [])

  const updateSong = useCallback(async (song: Song) => {
    setMutating(true)
    try {
      await saveSongWithSync(song)
      setSongs(await idbStorage.getSongs())
    } finally {
      setMutating(false)
    }
  }, [])

  const deleteSong = useCallback(async (id: string) => {
    setMutating(true)
    try {
      await deleteSongWithSync(id)
      setSongs(await idbStorage.getSongs())
    } finally {
      setMutating(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      songs,
      setSongs,
      initialLoading,
      mutating,
      loading: initialLoading,
      addSong,
      updateSong,
      deleteSong,
      refreshSongs,
    }),
    [
      songs,
      initialLoading,
      mutating,
      addSong,
      updateSong,
      deleteSong,
      refreshSongs,
    ],
  )

  return <SongsContext.Provider value={value}>{children}</SongsContext.Provider>
}

export function useSongs(): SongsContextValue {
  const ctx = useContext(SongsContext)
  if (!ctx) {
    throw new Error("useSongs must be used within SongsProvider")
  }
  return ctx
}
