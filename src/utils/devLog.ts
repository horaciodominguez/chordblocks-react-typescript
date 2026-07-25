const DEBUG_STORAGE_KEY = "chordblocks:debug"

/** Opt-in verbose logging in DEV: `localStorage.setItem('chordblocks:debug','1')` then reload. */
export function isDevDebug(): boolean {
  if (!import.meta.env.DEV) return false
  try {
    return localStorage.getItem(DEBUG_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

/** Noisy traces (storage reads, etc.) — off unless debug flag is set. */
export function devLog(...args: unknown[]): void {
  if (isDevDebug()) console.log(...args)
}

/** Optional verbose warnings — off unless debug flag is set. */
export function devWarn(...args: unknown[]): void {
  if (isDevDebug()) console.warn(...args)
}
