import { useCallback, useEffect, useState } from "react"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { useAuth } from "@/modules/auth/context/AuthContext"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import { getPendingQueueCount } from "@/modules/auth/utils/syncStatus"

/** Live count of song + set pending queue entries. */
export function usePendingQueueCount(): number {
  const { syncEpoch } = useAuth()
  const { mutating: songsMutating } = useSongs()
  const { mutating: setsMutating } = useRepertoires()
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    try {
      const n = await getPendingQueueCount({
        getPending: () => idbStorage.getPending(),
        getPendingRepertoires: () => idbStorage.getPendingRepertoires(),
      })
      setCount(n)
    } catch (err) {
      console.error("pending queue count failed", err)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh, syncEpoch, songsMutating, setsMutating])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh()
    }
    const onOnline = () => void refresh()
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("online", onOnline)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("online", onOnline)
    }
  }, [refresh])

  return count
}
