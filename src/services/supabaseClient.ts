import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Supabase Client Setup
 * Real client when env is set; otherwise a demo mock so the app still boots.
 *
 * Prefer the legacy JWT anon key (eyJ...) in VITE_SUPABASE_ANON_KEY.
 * sb_publishable_... keys can cause Invalid JWT with some SDK/gateway combos.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Loose client shape: real SDK or offline demo mock. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppSupabase = SupabaseClient | Record<string, any>

let supabase: AppSupabase

function createDemoAuth() {
  return {
    onAuthStateChange: (_callback: unknown) => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
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
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
  }
}

function createDemoQuery() {
  const result = { data: [] as unknown[], error: null as null }
  const singleResult = { data: null, error: null }
  const api: Record<string, unknown> = {}
  api.select = () => api
  api.insert = async () => result
  api.update = async () => result
  api.upsert = async () => result
  api.delete = () => api
  api.eq = () => api
  api.single = async () => singleResult
  api.then = (resolve: (v: typeof result) => unknown) =>
    Promise.resolve(result).then(resolve)
  return api
}

function createDemoClient(): AppSupabase {
  return {
    auth: createDemoAuth(),
    from: () => createDemoQuery(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  }
}

if (supabaseUrl && supabaseAnonKey) {
  if (
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.startsWith("sb_publishable_")
  ) {
    console.warn(
      "[ChordBlocks] VITE_SUPABASE_ANON_KEY looks like a publishable key (sb_publishable_…). " +
        "Prefer the legacy anon JWT (eyJ…) from Project Settings → API Keys if you see Invalid JWT errors.",
    )
  }

  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.error(
      "Failed to create Supabase client, falling back to DEMO:",
      err,
    )
    supabase = createDemoClient()
  }
} else {
  console.warn(
    "%c Supabase not configured. DEMO MODE activated.",
    "color: orange; font-weight: bold;",
  )
  console.warn(
    "Create a .env.local file based on .env.example to enable the real connection.",
  )

  supabase = createDemoClient()
}

export { supabase }
