import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  readGigLock,
  writeGigLock,
} from "@/modules/repertoires/utils/gigLockPreference"

type GigLockContextValue = {
  locked: boolean
  lock: () => void
  unlock: () => void
  setLocked: (next: boolean) => void
}

const GigLockContext = createContext<GigLockContextValue | null>(null)

export function GigLockProvider({ children }: { children: ReactNode }) {
  const [locked, setLockedState] = useState(() => readGigLock())

  const setLocked = useCallback((next: boolean) => {
    setLockedState(next)
    writeGigLock(next)
  }, [])

  const lock = useCallback(() => setLocked(true), [setLocked])
  const unlock = useCallback(() => setLocked(false), [setLocked])

  const value = useMemo(
    () => ({ locked, lock, unlock, setLocked }),
    [locked, lock, unlock, setLocked],
  )

  return (
    <GigLockContext.Provider value={value}>{children}</GigLockContext.Provider>
  )
}

export function useGigLock(): GigLockContextValue {
  const ctx = useContext(GigLockContext)
  if (!ctx) {
    throw new Error("useGigLock must be used within GigLockProvider")
  }
  return ctx
}
