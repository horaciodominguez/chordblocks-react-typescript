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
    let mounted = true

    // 🔹 1️⃣ Inicializar sesión al montar
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return

        const currentUser = data?.user ?? null
        setUser(currentUser)
        prevUserRef.current = currentUser
      } catch (err) {
        console.error("getUser error:", err)
      } finally {
        if (mounted) setReady(true)
      }
    }

    init()

    // 🔹 2️⃣ Listener de cambios
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

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return { user, ready }
}
