import {
  AUTO_SCROLL_STORAGE_KEY,
  DEFAULT_AUTO_SCROLL_SPEED,
  isAutoScrollSpeed,
  type AutoScrollPreference,
  type AutoScrollSpeed,
} from "@/modules/songs/types/autoScroll.types"

const DEFAULT_PREFS: AutoScrollPreference = {
  speed: DEFAULT_AUTO_SCROLL_SPEED,
}

export function readAutoScrollPreference(): AutoScrollPreference {
  try {
    const raw = localStorage.getItem(AUTO_SCROLL_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as { speed?: unknown }
    const speed: AutoScrollSpeed = isAutoScrollSpeed(parsed.speed)
      ? parsed.speed
      : DEFAULT_AUTO_SCROLL_SPEED
    return { speed }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function writeAutoScrollPreference(
  prefs: AutoScrollPreference,
): void {
  try {
    localStorage.setItem(
      AUTO_SCROLL_STORAGE_KEY,
      JSON.stringify({ speed: prefs.speed }),
    )
  } catch {
    /* ignore */
  }
}
