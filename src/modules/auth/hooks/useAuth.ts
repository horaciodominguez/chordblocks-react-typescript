import { useEffect, useState, useRef } from "react"
import { supabase } from "@/services/supabaseClient"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import { syncAll } from "@/services/sync/syncManager"

export const syncdb = async () => await syncAll()

export function useAuth() {
  console.log("🔑 useAuth hook initialized")
  const [user, setUser] = useState<User | null>(null)
  const prevUserRef = useRef<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const newUser = session?.user ?? null

        setReady(false)

        if (!prevUserRef.current && newUser) {
          await syncdb()
        }

        setUser(newUser)
        prevUserRef.current = newUser

        setReady(true)
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, ready }
}
