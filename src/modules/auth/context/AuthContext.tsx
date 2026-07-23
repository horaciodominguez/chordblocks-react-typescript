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
  resolveSyncOrphans,
  type SongSyncConflict,
  type SongSyncConflictResolution,
  type SyncAllResult,
} from "@/services/sync/syncManager"
import { isSyncAbortError, isSyncTimeoutError } from "@/services/sync/abort"
import { ensureLocalSongs } from "@/modules/songs/utils/seedLocalSongs"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { toast } from "sonner"
import { SongSyncConflictDialog } from "@/modules/auth/components/SongSyncConflictDialog"
import { SyncOrphanDialog } from "@/modules/auth/components/SyncOrphanDialog"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

type AuthContextValue = {
  user: User | null
  ready: boolean
  syncEpoch: number
  syncing: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SYNC_TIMEOUT_MS = 15_000
const RESYNC_DEBOUNCE_MS = 2_000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const prevUserRef = useRef<User | null>(null)
  const [ready, setReady] = useState(false)
  const [syncEpoch, setSyncEpoch] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [conflicts, setConflicts] = useState<SongSyncConflict[]>([])
  const [orphanSongs, setOrphanSongs] = useState<Song[]>([])
  const [orphanRepertoires, setOrphanRepertoires] = useState<Repertoire[]>([])
  const [resolvingConflicts, setResolvingConflicts] = useState(false)
  const [resolvingOrphans, setResolvingOrphans] = useState(false)
  const syncingRef = useRef(false)
  const syncAbortRef = useRef<AbortController | null>(null)
  /** Resolves when the current exclusive sync fully finishes (incl. after abort). */
  const syncLockTailRef = useRef(Promise.resolve())
  const userRef = useRef<User | null>(null)

  const bumpSyncEpoch = () => setSyncEpoch((n) => n + 1)

  const applySyncResult = (result: SyncAllResult) => {
    setConflicts(result.conflicts)
    setOrphanSongs(result.orphanSongs)
    setOrphanRepertoires(result.orphanRepertoires)
    bumpSyncEpoch()
  }

  /**
   * Runs at most one sync at a time. Timeout aborts the in-flight work via
   * AbortSignal; the mutex is only released after that work settles.
   * Background callers skip when busy; preempt aborts the current run first.
   */
  const withSyncLock = async (
    work: (signal: AbortSignal) => Promise<SyncAllResult>,
    opts: { preempt?: boolean } = {},
  ): Promise<SyncAllResult | undefined> => {
    if (!opts.preempt && syncingRef.current) {
      return undefined
    }

    if (opts.preempt && syncAbortRef.current) {
      syncAbortRef.current.abort("preempted")
    }

    const prev = syncLockTailRef.current
    let releaseLock!: () => void
    syncLockTailRef.current = new Promise<void>((resolve) => {
      releaseLock = resolve
    })

    await prev

    const ac = new AbortController()
    syncAbortRef.current = ac
    syncingRef.current = true
    setSyncing(true)

    const timer = setTimeout(() => {
      ac.abort("timeout")
    }, SYNC_TIMEOUT_MS)

    try {
      return await work(ac.signal)
    } finally {
      clearTimeout(timer)
      if (syncAbortRef.current === ac) {
        syncAbortRef.current = null
      }
      syncingRef.current = false
      setSyncing(false)
      releaseLock()
    }
  }

  const syncInBackground = async (showToastOnFail = false) => {
    try {
      const result = await withSyncLock((signal) => syncAll({ signal }))
      if (!result) return
      applySyncResult(result)
    } catch (err) {
      if (isSyncAbortError(err)) {
        if (showToastOnFail && isSyncTimeoutError(err)) {
          toast.error("Sync failed or timed out. Showing local data.")
        }
        console.error("syncAll aborted:", err)
        return
      }
      console.error("syncAll error:", err)
      if (showToastOnFail) {
        toast.error("Sync failed or timed out. Showing local data.")
      }
    }
  }

  const handleApplyResolutions = async (
    resolutions: SongSyncConflictResolution[],
  ) => {
    setResolvingConflicts(true)
    try {
      const result = await withSyncLock(
        (signal) => resolveSyncConflicts(resolutions, signal),
        { preempt: true },
      )
      if (!result) return
      applySyncResult(result)
    } catch (err) {
      if (isSyncAbortError(err)) {
        console.error("resolveSyncConflicts aborted:", err)
        if (isSyncTimeoutError(err)) {
          toast.error("Could not apply sync choices. Try again.")
        }
        return
      }
      console.error("resolveSyncConflicts error:", err)
      toast.error("Could not apply sync choices. Try again.")
    } finally {
      setResolvingConflicts(false)
    }
  }

  const handleResolveOrphans = async (action: "delete" | "keep") => {
    setResolvingOrphans(true)
    try {
      const result = await withSyncLock(
        (signal) =>
          resolveSyncOrphans({
            songIds: orphanSongs.map((s) => s.id),
            repertoireIds: orphanRepertoires.map((r) => r.id),
            action,
            signal,
          }),
        { preempt: true },
      )
      if (!result) return
      applySyncResult(result)
      toast.success(
        action === "delete"
          ? "Local-only items removed from this device."
          : "Local-only items queued for upload.",
      )
    } catch (err) {
      console.error("resolveSyncOrphans error:", err)
      toast.error("Could not apply orphan choice. Try again.")
    } finally {
      setResolvingOrphans(false)
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
          syncAbortRef.current?.abort("signed_out")
          setConflicts([])
          setOrphanSongs([])
          setOrphanRepertoires([])
          void (async () => {
            try {
              // Keep path: local charts stay. Clear path: IDB already wiped;
              // seed demos for anonymous use when empty.
              await ensureLocalSongs({ hasSession: false })
            } catch (err) {
              console.error("post-logout local seed error:", err)
            }
            bumpSyncEpoch()
          })()
          return
        }

        if (isLogin || isUserSwitch || event === "SIGNED_IN") {
          void (async () => {
            if (newUser) {
              await idbStorage.prepareForUser(newUser.id)
            }
            // Preempt any stale background sync after account change
            try {
              const result = await withSyncLock(
                (signal) => syncAll({ signal }),
                { preempt: true },
              )
              if (!result) return
              applySyncResult(result)
            } catch (err) {
              console.error("syncAll error:", err)
              if (isSyncTimeoutError(err)) {
                toast.error("Sync failed or timed out. Showing local data.")
              } else if (!isSyncAbortError(err)) {
                toast.error("Sync failed or timed out. Showing local data.")
              }
            }
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
      syncAbortRef.current?.abort("unmount")
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
      <SyncOrphanDialog
        songs={orphanSongs}
        repertoires={orphanRepertoires}
        open={
          conflicts.length === 0 &&
          (orphanSongs.length > 0 || orphanRepertoires.length > 0)
        }
        applying={resolvingOrphans}
        onResolve={(action) => void handleResolveOrphans(action)}
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
