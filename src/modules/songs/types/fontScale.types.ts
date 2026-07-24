export type AtrilFontScale = "s" | "m" | "l" | "xl"

export const ATRIL_FONT_SCALES = ["s", "m", "l", "xl"] as const

export const ATRIL_FONT_SCALE_LABELS: Record<AtrilFontScale, string> = {
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
}

export const DEFAULT_ATRIL_FONT_SCALE: AtrilFontScale = "m"

export const ATRIL_FONT_SCALE_STORAGE_KEY = "chordblocks:atrilFontScale"

export function isAtrilFontScale(v: string | null): v is AtrilFontScale {
  return v === "s" || v === "m" || v === "l" || v === "xl"
}
