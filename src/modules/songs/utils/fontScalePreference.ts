import {
  ATRIL_FONT_SCALE_STORAGE_KEY,
  DEFAULT_ATRIL_FONT_SCALE,
  isAtrilFontScale,
  type AtrilFontScale,
} from "@/modules/songs/types/fontScale.types"

export function readAtrilFontScale(): AtrilFontScale {
  try {
    const stored = localStorage.getItem(ATRIL_FONT_SCALE_STORAGE_KEY)
    if (isAtrilFontScale(stored)) return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_ATRIL_FONT_SCALE
}

export function writeAtrilFontScale(scale: AtrilFontScale): void {
  try {
    localStorage.setItem(ATRIL_FONT_SCALE_STORAGE_KEY, scale)
  } catch {
    /* ignore */
  }
}
