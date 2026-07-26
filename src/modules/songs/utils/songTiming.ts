import type { Song } from "@/modules/songs/types/song.types"
import type { SongSection } from "@/modules/songs/types/section.types"
import type { Bar } from "@/modules/songs/types/bar.types"
import { DEFAULT_SONG_BPM_FOR_SCROLL } from "@/modules/songs/types/autoScroll.types"

/** Beats in one bar (sum of block durations). */
export function countBarBeats(bar: Bar): number {
  return bar.blocks.reduce((sum, b) => sum + b.duration, 0)
}

/** Beats in one section pass (including repeats). */
export function countSectionBeats(section: SongSection): number {
  const once = section.bars.reduce((sum, bar) => sum + countBarBeats(bar), 0)
  return once * Math.max(1, section.repeats)
}

/** Total playable beats in the chart (sections × repeats). */
export function countSongBeats(song: Pick<Song, "songSections">): number {
  return song.songSections.reduce(
    (sum, section) => sum + countSectionBeats(section),
    0,
  )
}

/** Wall-clock duration from beats + tempo (set length estimates, etc.). */
export function estimateSongDurationSeconds(
  totalBeats: number,
  bpm: number,
): number {
  const tempo =
    Number.isFinite(bpm) && bpm > 0 ? bpm : DEFAULT_SONG_BPM_FOR_SCROLL
  const beats = Math.max(0, totalBeats)
  if (beats <= 0) return 0
  return (beats * 60) / tempo
}

export function formatDurationLabel(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—"
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return m > 0 ? `${m}:${r.toString().padStart(2, "0")}` : `${s}s`
}
