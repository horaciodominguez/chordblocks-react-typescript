export const STAGE_MODE_STORAGE_KEY = "chordblocks:stageMode"

/** High-contrast stage mode for Play (atril). */
export function readStageMode(): boolean {
  try {
    return localStorage.getItem(STAGE_MODE_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function writeStageMode(enabled: boolean): void {
  try {
    if (enabled) localStorage.setItem(STAGE_MODE_STORAGE_KEY, "1")
    else localStorage.removeItem(STAGE_MODE_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Apply / clear stage surfaces on <html> + <body>.
 * Inline body styles beat Tailwind utilities (bg-[url], light gradient).
 */
export function applyStageModeToDocument(enabled: boolean): void {
  if (typeof document === "undefined") return

  const meta = document.querySelector('meta[name="theme-color"]')
  const body = document.body

  if (enabled) {
    document.documentElement.dataset.stage = "on"
    if (body) {
      body.style.setProperty("background-color", "#000", "important")
      body.style.setProperty("background-image", "none", "important")
      body.style.setProperty("color", "#fafafa", "important")
    }
    meta?.setAttribute("content", "#000000")
    return
  }

  delete document.documentElement.dataset.stage
  if (body) {
    body.style.removeProperty("background-color")
    body.style.removeProperty("background-image")
    body.style.removeProperty("color")
  }
  const light = document.documentElement.dataset.theme === "light"
  meta?.setAttribute("content", light ? "#eef1f5" : "#0a0a0a")
}
