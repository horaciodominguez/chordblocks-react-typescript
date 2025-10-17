import { createClient } from "@supabase/supabase-js"

/**
 * Supabase Client Setup
 * ---------------------
 * This file initializes the Supabase connection
 * or falls back to a mock client when environment variables are missing.
 *
 * This allows:
 *  - Running the app in "demo mode" without breaking anything
 *  - Showcasing the project on GitHub/LinkedIn without requiring setup
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    "%c⚠️ Supabase not configured. DEMO MODE activated.",
    "color: orange; font-weight: bold;"
  )
  console.warn(
    "Create a .env.local file based on .env.example to enable the real connection."
  )

  supabase = {
    auth: {
      signInWithOtp: async () => ({
        data: null,
        error: null,
      }),
      signOut: async () => ({
        error: null,
      }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
    },
    from: () => ({
      select: async () => ({
        data: [],
        error: null,
      }),
      insert: async () => ({
        data: null,
        error: null,
      }),
      update: async () => ({
        data: null,
        error: null,
      }),
      delete: async () => ({
        data: null,
        error: null,
      }),
    }),
  }
}

export { supabase }
