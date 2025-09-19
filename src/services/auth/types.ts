import type { User, Session } from "@supabase/supabase-js"

export type AuthState = {
  user: User | null
  session: Session | null
}

export interface AuthProvider {
  signIn(email: string): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
}
