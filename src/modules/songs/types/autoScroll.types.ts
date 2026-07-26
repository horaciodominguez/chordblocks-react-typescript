export type AutoScrollSpeed = "slow" | "medium" | "fast"

export const AUTO_SCROLL_SPEEDS = [
  "slow",
  "medium",
  "fast",
] as const satisfies readonly AutoScrollSpeed[]

export const AUTO_SCROLL_SPEED_LABELS: Record<AutoScrollSpeed, string> = {
  slow: "S",
  medium: "M",
  fast: "F",
}

/** Multipliers on sync clock rate (section cue timeline). */
export const AUTO_SCROLL_SPEED_MULT: Record<AutoScrollSpeed, number> = {
  slow: 0.75,
  medium: 1,
  fast: 1.2,
}

export const DEFAULT_AUTO_SCROLL_SPEED: AutoScrollSpeed = "medium"

export const MIN_SONG_BPM = 40
export const MAX_SONG_BPM = 240
export const DEFAULT_SONG_BPM_FOR_SCROLL = 100

export const AUTO_SCROLL_STORAGE_KEY = "chordblocks:autoScroll"

export type AutoScrollPreference = {
  speed: AutoScrollSpeed
}

export function isAutoScrollSpeed(v: unknown): v is AutoScrollSpeed {
  return v === "slow" || v === "medium" || v === "fast"
}

export function clampSongBpm(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SONG_BPM_FOR_SCROLL
  return Math.min(MAX_SONG_BPM, Math.max(MIN_SONG_BPM, Math.round(n)))
}
