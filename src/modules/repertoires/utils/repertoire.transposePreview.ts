import { transposeChordName } from "@/modules/chords/utils/transpose"
import type { Song } from "@/modules/songs/types/song.types"

export function formatSemitoneOffset(semitones: number): string {
  return semitones > 0 ? `+${semitones}` : String(semitones)
}

/** Anchor for preview: mainKey, else first chord name in the chart. */
export function getSongKeyAnchor(song: Song): string | undefined {
  const key = song.mainKey?.trim()
  if (key) return key

  for (const section of song.songSections) {
    for (const bar of section.bars) {
      for (const block of bar.blocks) {
        const name = block.chord?.name?.trim()
        if (block.type === "chord" && name) return name
      }
    }
  }
  return undefined
}

/**
 * Badge / preview label for a transpose offset.
 * e.g. "+1 · Bm → Cm" or "+1" when no anchor.
 */
export function formatTransposePreview(
  song: Song | undefined,
  semitones: number,
): string | null {
  if (semitones === 0) return null
  const offset = formatSemitoneOffset(semitones)
  if (!song) return offset
  const anchor = getSongKeyAnchor(song)
  if (!anchor) return offset
  const projected = transposeChordName(anchor, semitones)
  return `${offset} · ${anchor} → ${projected}`
}
