import { useCallback, useMemo, useState } from "react"
import { SongPlayerContext, type SeekRequest } from "./playerContext"

type ProviderProps = {
  videoId: string | null
  children: React.ReactNode
}

export function SongPlayerProvider({ videoId, children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [seekRequest, setSeekRequest] = useState<SeekRequest | null>(null)

  const open = useCallback(
    (seconds?: number) => {
      if (!videoId) return
      setIsOpen(true)
      if (seconds !== undefined) {
        setSeekRequest((prev) => ({ seconds, nonce: (prev?.nonce ?? 0) + 1 }))
      }
    },
    [videoId],
  )

  const close = useCallback(() => {
    setIsOpen(false)
    setSeekRequest(null)
  }, [])

  const value = useMemo(
    () => ({ videoId, isOpen, seekRequest, open, close }),
    [videoId, isOpen, seekRequest, open, close],
  )

  return (
    <SongPlayerContext.Provider value={value}>
      {children}
    </SongPlayerContext.Provider>
  )
}
