export const CHORD_PREVIEW_STORAGE_KEY = "chordblocks:chordPreview"

/** Default on — disable in Settings → Appearance if unwanted. */
export function readChordPreviewPreference(): boolean {
  try {
    const v = localStorage.getItem(CHORD_PREVIEW_STORAGE_KEY)
    if (v === null) return true
    return v === "1"
  } catch {
    return true
  }
}

export function writeChordPreviewPreference(enabled: boolean): void {
  try {
    localStorage.setItem(CHORD_PREVIEW_STORAGE_KEY, enabled ? "1" : "0")
  } catch {
    /* ignore */
  }
}
