import { createClient } from "@supabase/supabase-js"

/**
 * Supabase Client Setup
 * ---------------------
 * Real client when env is set; otherwise a demo mock so the app still boots.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | any

function createDemoAuth() {
  return {
    onAuthStateChange: (_callback: any) => {
      // Do not fire sync-triggering events on subscribe (was crashing UX / races)
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    },
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

/** Fluent chain stub: .from().select().eq().single() etc. */
function createDemoQuery() {
  const result = { data: [] as unknown[], error: null as null }
  const singleResult = { data: null, error: null }
  const api: any = {
    select: () => api,
    insert: async () => result,
    update: async () => result,
    upsert: async () => result,
    delete: () => api,
    eq: () => api,
    single: async () => singleResult,
    then: (resolve: (v: typeof result) => unknown) =>
      Promise.resolve(result).then(resolve),
  }
  return api
}

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.error("Failed to create Supabase client, falling back to DEMO:", err)
    supabase = {
      auth: createDemoAuth(),
      from: () => createDemoQuery(),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    }
  }
} else {
  console.warn(
    "%c Supabase not configured. DEMO MODE activated.",
    "color: orange; font-weight: bold;",
  )
  console.warn(
    "Create a .env.local file based on .env.example to enable the real connection.",
  )

  supabase = {
    auth: createDemoAuth(),
    from: () => createDemoQuery(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  }
}

export { supabase }
