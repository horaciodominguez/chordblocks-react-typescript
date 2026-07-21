import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { supabase } from "@/services/supabaseClient"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import {
  syncAll,
  resolveSyncConflicts,
  type SongSyncConflict,
  type SongSyncConflictResolution,
} from "@/services/sync/syncManager"
import { ensureLocalSongs } from "@/modules/songs/utils/seedLocalSongs"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { toast } from "sonner"
import { SongSyncConflictDialog } from "@/modules/auth/components/SongSyncConflictDialog"

type AuthContextValue = {
  user: User | null
  ready: boolean
  syncEpoch: number
  syncing: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SYNC_TIMEOUT_MS = 15_000
const RESYNC_DEBOUNCE_MS = 2_000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("sync timeout")), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      },
    )
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const prevUserRef = useRef<User | null>(null)
  const [ready, setReady] = useState(false)
  const [syncEpoch, setSyncEpoch] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [conflicts, setConflicts] = useState<SongSyncConflict[]>([])
  const [resolvingConflicts, setResolvingConflicts] = useState(false)
  const syncingRef = useRef(false)
  const userRef = useRef<User | null>(null)

  const bumpSyncEpoch = () => setSyncEpoch((n) => n + 1)

  const syncInBackground = async (showToastOnFail = false) => {
    if (syncingRef.current) return
    syncingRef.current = true
    setSyncing(true)
    try {
      const result = await withTimeout(syncAll(), SYNC_TIMEOUT_MS)
      if (result.conflicts.length > 0) {
        setConflicts(result.conflicts)
      } else {
        setConflicts([])
      }
      bumpSyncEpoch()
    } catch (err) {
      console.error("syncAll error:", err)
      if (showToastOnFail) {
        toast.error("Sync failed or timed out. Showing local data.")
      }
    } finally {
      syncingRef.current = false
      setSyncing(false)
    }
  }

  const handleApplyResolutions = async (
    resolutions: SongSyncConflictResolution[],
  ) => {
    setResolvingConflicts(true)
    try {
      const result = await withTimeout(
        resolveSyncConflicts(resolutions),
        SYNC_TIMEOUT_MS,
      )
      setConflicts(result.conflicts)
      bumpSyncEpoch()
    } catch (err) {
      console.error("resolveSyncConflicts error:", err)
      toast.error("Could not apply sync choices. Try again.")
    } finally {
      setResolvingConflicts(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        // No session is normal when logged out — only log unexpected errors
        if (
          error &&
          error.name !== "AuthSessionMissingError" &&
          error.message !== "Auth session missing!"
        ) {
          console.error("getUser error:", error)
        }
        if (!mounted) return

        const currentUser = data?.user ?? null
        setUser(currentUser)
        prevUserRef.current = currentUser
        userRef.current = currentUser

        if (currentUser) {
          await idbStorage.prepareForUser(currentUser.id)
          // Unblock UI immediately — sync in background (A1)
          if (mounted) setReady(true)
          void syncInBackground(true)
        } else {
          await ensureLocalSongs({ hasSession: false })
          if (mounted) setReady(true)
        }
      } catch (err) {
        console.error("auth init error:", err)
        try {
          await ensureLocalSongs({ hasSession: false })
        } catch {
          /* ignore */
        }
        if (mounted) setReady(true)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "INITIAL_SESSION") return

        if (event === "TOKEN_REFRESHED") {
          const refreshed = session?.user ?? null
          if (refreshed) {
            setUser(refreshed)
            prevUserRef.current = refreshed
            userRef.current = refreshed
          }
          return
        }

        const newUser = session?.user ?? null
        const wasLoggedOut = !prevUserRef.current
        const isLogin = wasLoggedOut && !!newUser
        const isUserSwitch =
          !!prevUserRef.current &&
          !!newUser &&
          prevUserRef.current.id !== newUser.id

        setUser(newUser)
        prevUserRef.current = newUser
        userRef.current = newUser

        if (event === "SIGNED_OUT" || (!newUser && !wasLoggedOut)) {
          setConflicts([])
          bumpSyncEpoch()
          return
        }

        if (isLogin || isUserSwitch || event === "SIGNED_IN") {
          void (async () => {
            if (newUser) {
              await idbStorage.prepareForUser(newUser.id)
            }
            await syncInBackground(true)
          })()
        }
      },
    )

    // A5: re-sync on focus / online
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const scheduleResync = () => {
      if (!userRef.current) return
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (document.visibilityState === "visible" && userRef.current) {
          void syncInBackground(false)
        }
      }, RESYNC_DEBOUNCE_MS)
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") scheduleResync()
    }
    const onOnline = () => scheduleResync()

    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("online", onOnline)

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("online", onOnline)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(
    () => ({ user, ready, syncEpoch, syncing }),
    [user, ready, syncEpoch, syncing],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SongSyncConflictDialog
        conflicts={conflicts}
        open={conflicts.length > 0}
        applying={resolvingConflicts}
        onApply={handleApplyResolutions}
      />
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export const syncdb = async () => await syncAll()
