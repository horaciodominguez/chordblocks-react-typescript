import { useEffect, useState } from "react"
import { supabase } from "@/services/supabaseClient"
import type { User } from "@supabase/supabase-js"

import { syncAll } from "@/services/sync/syncManager"

export const syncdb = async () => await syncAll()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
