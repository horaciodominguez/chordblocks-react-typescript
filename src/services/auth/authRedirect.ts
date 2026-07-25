/**
 * Auth redirect helpers — magic links must match Supabase allowlist.
 * Unlisted origins fall back to Site URL (often http://localhost:3000).
 */

export function getAuthEmailRedirectTo(): string | undefined {
  if (typeof window === "undefined") return undefined
  return window.location.origin
}

/** True for typical home/LAN hosts used when testing from a phone. */
export function isPrivateNetworkOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    if (hostname === "localhost" || hostname === "127.0.0.1") return false
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
    return false
  } catch {
    return false
  }
}

/** Exact + wildcard entries to paste into Supabase → Redirect URLs. */
export function supabaseRedirectAllowlistHints(origin: string): string[] {
  const hints = [
    "http://localhost:5173/**",
    "http://127.0.0.1:5173/**",
    "http://192.168.*.*:5173/**",
  ]
  if (origin && !hints.includes(`${origin}/**`)) {
    hints.unshift(`${origin}/**`)
  }
  return hints
}
