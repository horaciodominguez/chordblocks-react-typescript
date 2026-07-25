import { supabase } from "@/services/supabaseClient"
import { getAuthEmailRedirectTo } from "@/services/auth/authRedirect"

export { getAuthEmailRedirectTo } from "@/services/auth/authRedirect"

export async function signIn(email: string) {
  const emailRedirectTo = getAuthEmailRedirectTo()
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  })
  if (error) throw error
  return data
}

/** Complete login with the 6-digit code from the email (no browser redirect). */
export async function verifyEmailOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: "email",
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
