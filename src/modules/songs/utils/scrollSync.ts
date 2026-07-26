import type { SongSection } from "@/modules/songs/types/section.types"
import type { AutoScrollSpeed } from "@/modules/songs/types/autoScroll.types"
import { AUTO_SCROLL_SPEED_MULT } from "@/modules/songs/types/autoScroll.types"

export type ScrollCue = {
  sectionId: string
  /** Absolute cue time in seconds (song/video clock). */
  t: number
}

export type ScrollAnchor = ScrollCue & {
  /** Window scrollY that puts the section under the sticky chrome. */
  scrollY: number
}

/** Sections that have a sync cue, in chart order then by time. */
export function collectScrollCues(
  sections: Pick<SongSection, "id" | "cueTime">[],
): ScrollCue[] {
  const cues: ScrollCue[] = []
  for (const s of sections) {
    if (typeof s.cueTime === "number" && Number.isFinite(s.cueTime) && s.cueTime >= 0) {
      cues.push({ sectionId: s.id, t: Math.round(s.cueTime) })
    }
  }
  return cues.sort((a, b) => a.t - b.t || a.sectionId.localeCompare(b.sectionId))
}

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u
}

function clamp01(u: number): number {
  if (u <= 0) return 0
  if (u >= 1) return 1
  return u
}

/**
 * Target window scrollY for playback time `nowSec`.
 *
 * - Before first cue: ease from 0 → first.scrollY over [0, first.t]
 * - Between cues: lerp scrollY by time
 * - After last cue: stay on last.scrollY (do not continue to chart end)
 *
 * Returns null when there are no anchors.
 */
export function targetScrollYAtTime(
  nowSec: number,
  anchors: ScrollAnchor[],
): number | null {
  if (anchors.length === 0) return null
  const sorted = [...anchors].sort((a, b) => a.t - b.t)
  const t = Math.max(0, nowSec)

  const first = sorted[0]
  if (t <= first.t) {
    if (first.t <= 0) return first.scrollY
    return lerp(0, first.scrollY, clamp01(t / first.t))
  }

  const last = sorted[sorted.length - 1]
  if (t >= last.t) return last.scrollY

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (t >= a.t && t <= b.t) {
      const span = Math.max(0.001, b.t - a.t)
      return lerp(a.scrollY, b.scrollY, clamp01((t - a.t) / span))
    }
  }

  return last.scrollY
}

/** Scale wall-clock → sync clock (S/M/F). */
export function syncClockRate(speed: AutoScrollSpeed): number {
  return AUTO_SCROLL_SPEED_MULT[speed]
}

/** Parse `m:ss` / `h:mm:ss` / plain seconds → integer seconds. */
export function parseCueTimeInput(raw: string): number | undefined {
  const s = raw.trim()
  if (s === "") return undefined
  if (/^\d+$/.test(s)) {
    return Math.max(0, parseInt(s, 10))
  }
  const parts = s.split(":").map((p) => p.trim())
  if (parts.length === 2 || parts.length === 3) {
    const nums = parts.map((p) => Number(p))
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return undefined
    if (parts.length === 2) {
      const [m, sec] = nums
      if (sec >= 60) return undefined
      return Math.round(m * 60 + sec)
    }
    const [h, m, sec] = nums
    if (m >= 60 || sec >= 60) return undefined
    return Math.round(h * 3600 + m * 60 + sec)
  }
  return undefined
}

/** Format seconds as `m:ss` (or `h:mm:ss` if ≥ 1h). */
export function formatCueTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`
  }
  return `${m}:${r.toString().padStart(2, "0")}`
}
