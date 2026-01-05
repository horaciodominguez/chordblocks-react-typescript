import { useEffect, useState } from "react"
import { supabase } from "@/services/supabaseClient"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"

import { syncAll } from "@/services/sync/syncManager"

export const syncdb = async () => await syncAll()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) => {
        setUser(data.user)
      })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        syncdb()
      }
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return { user }
}
