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
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import {
  deleteRepertoireWithSync,
  saveRepertoireWithSync,
} from "@/services/sync/syncManager"
import { useAuth } from "@/modules/auth/context/AuthContext"
import { createEmptyRepertoire } from "@/modules/repertoires/utils/repertoire.factory"
import { RepertoireSchema } from "@/modules/repertoires/schemas/repertoire.schema"

type RepertoiresContextValue = {
  repertoires: Repertoire[]
  initialLoading: boolean
  mutating: boolean
  addRepertoire: (title?: string) => Promise<Repertoire>
  updateRepertoire: (rep: Repertoire) => Promise<void>
  deleteRepertoire: (id: string) => Promise<void>
  getRepertoire: (id: string) => Repertoire | undefined
  refreshRepertoires: () => Promise<void>
}

const RepertoiresContext = createContext<RepertoiresContextValue | null>(null)

export function RepertoiresProvider({ children }: { children: ReactNode }) {
  const { user, ready, syncEpoch } = useAuth()
  const [repertoires, setRepertoires] = useState<Repertoire[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [mutating, setMutating] = useState(false)
  const initialLoadDone = useRef(false)

  const refreshRepertoires = useCallback(async () => {
    const list = await idbStorage.getRepertoires()
    setRepertoires(
      list.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    )
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      const showFullLoader = !initialLoadDone.current
      if (showFullLoader) setInitialLoading(true)

      try {
        const list = await idbStorage.getRepertoires()
        if (mounted) {
          setRepertoires(
            list.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            ),
          )
        }
      } catch (err) {
        console.error("RepertoiresProvider init error:", err)
        if (mounted) setRepertoires([])
      } finally {
        if (mounted) {
          setInitialLoading(false)
          initialLoadDone.current = true
        }
      }
    }

    if (!ready) return
    void init()

    return () => {
      mounted = false
    }
  }, [ready, user])

  useEffect(() => {
    if (!ready || !initialLoadDone.current) return
    if (syncEpoch === 0) return
    void refreshRepertoires()
  }, [syncEpoch, ready, refreshRepertoires])

  const addRepertoire = useCallback(
    async (title?: string) => {
      setMutating(true)
      try {
        const created = createEmptyRepertoire(title)
        const parsed = RepertoireSchema.parse(created)
        await saveRepertoireWithSync(parsed)
        await refreshRepertoires()
        return parsed
      } finally {
        setMutating(false)
      }
    },
    [refreshRepertoires],
  )

  const updateRepertoire = useCallback(
    async (rep: Repertoire) => {
      setMutating(true)
      try {
        const parsed = RepertoireSchema.parse(rep)
        await saveRepertoireWithSync(parsed)
        await refreshRepertoires()
      } finally {
        setMutating(false)
      }
    },
    [refreshRepertoires],
  )

  const deleteRepertoire = useCallback(
    async (id: string) => {
      setMutating(true)
      try {
        await deleteRepertoireWithSync(id)
        await refreshRepertoires()
      } finally {
        setMutating(false)
      }
    },
    [refreshRepertoires],
  )

  const getRepertoire = useCallback(
    (id: string) => repertoires.find((r) => r.id === id),
    [repertoires],
  )

  const value = useMemo(
    () => ({
      repertoires,
      initialLoading,
      mutating,
      addRepertoire,
      updateRepertoire,
      deleteRepertoire,
      getRepertoire,
      refreshRepertoires,
    }),
    [
      repertoires,
      initialLoading,
      mutating,
      addRepertoire,
      updateRepertoire,
      deleteRepertoire,
      getRepertoire,
      refreshRepertoires,
    ],
  )

  return (
    <RepertoiresContext.Provider value={value}>
      {children}
    </RepertoiresContext.Provider>
  )
}

export function useRepertoires(): RepertoiresContextValue {
  const ctx = useContext(RepertoiresContext)
  if (!ctx) {
    throw new Error("useRepertoires must be used within RepertoiresProvider")
  }
  return ctx
}
