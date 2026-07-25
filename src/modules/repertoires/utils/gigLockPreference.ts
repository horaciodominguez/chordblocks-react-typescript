export const GIG_LOCK_STORAGE_KEY = "chordblocks:gigLock"

/** Persist gig read-only lock (S2.8) — survives Play exit so Edit stays blocked. */
export function readGigLock(): boolean {
  try {
    return localStorage.getItem(GIG_LOCK_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function writeGigLock(enabled: boolean): void {
  try {
    if (enabled) localStorage.setItem(GIG_LOCK_STORAGE_KEY, "1")
    else localStorage.removeItem(GIG_LOCK_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
