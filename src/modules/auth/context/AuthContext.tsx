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
import { syncAll } from "@/services/sync/syncManager"
import { ensureLocalSongs } from "@/modules/songs/utils/seedLocalSongs"

type AuthContextValue = {
  user: User | null
  ready: boolean
  /** Bumps after each successful/attempted sync so SongsProvider can refresh IDB */
  syncEpoch: number
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function runSyncSafe(): Promise<void> {
  try {
    await syncAll()
  } catch (err) {
    console.error("syncAll error:", err)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const prevUserRef = useRef<User | null>(null)
  const [ready, setReady] = useState(false)
  const [syncEpoch, setSyncEpoch] = useState(0)
  const syncingRef = useRef(false)

  const bumpSyncEpoch = () => setSyncEpoch((n) => n + 1)

  const syncInBackground = async () => {
    if (syncingRef.current) return
    syncingRef.current = true
    try {
      await runSyncSafe()
      bumpSyncEpoch()
    } finally {
      syncingRef.current = false
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) console.error("getUser error:", error)
        if (!mounted) return

        const currentUser = data?.user ?? null
        setUser(currentUser)
        prevUserRef.current = currentUser

        if (currentUser) {
          // Logged in: pull cloud FIRST — never seed empty IDB before sync
          // (seeding+pending was overwriting Supabase with mock titles)
          await runSyncSafe()
          if (mounted) bumpSyncEpoch()
        } else {
          // Anonymous: seed mockups into local + pending
          await ensureLocalSongs({ hasSession: false })
        }
      } catch (err) {
        console.error("auth init error:", err)
        // Fallback: still try anonymous seed so UI has something
        try {
          await ensureLocalSongs({ hasSession: false })
        } catch {
          /* ignore */
        }
      } finally {
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
          }
          return
        }

        const newUser = session?.user ?? null
        const wasLoggedOut = !prevUserRef.current
        const isLogin = wasLoggedOut && !!newUser

        setUser(newUser)
        prevUserRef.current = newUser

        if (event === "SIGNED_OUT" || (!newUser && !wasLoggedOut)) {
          bumpSyncEpoch()
          return
        }

        // Login: sync pulls remote; do not seed first
        if (isLogin || event === "SIGNED_IN") {
          void syncInBackground()
        }
      },
    )

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only auth bootstrap
  }, [])

  const value = useMemo(
    () => ({ user, ready, syncEpoch }),
    [user, ready, syncEpoch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export const syncdb = async () => await syncAll()
