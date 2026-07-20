import { parseChordName } from "@/modules/chords/utils/chord.utils"
import type { Song } from "@/modules/songs/types/song.types"
import type { Block } from "@/modules/songs/types/block.types"
import type { SongSection } from "@/modules/songs/types/section.types"
import type { Bar } from "@/modules/songs/types/bar.types"

const NOTES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

const NOTES_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  "E#": 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
}

function wrapSemitones(semitones: number): number {
  return ((semitones % 12) + 12) % 12
}

function splitRootSuffix(name: string): { root: string; suffix: string } | null {
  const m = name.match(/^([A-G][#b]?)(.*)$/)
  if (!m) return null
  return { root: m[1], suffix: m[2] ?? "" }
}

/**
 * Transpose a chord name by semitones. Preserves suffix (m, 7, sus4, …).
 * Slash chords transpose both sides (e.g. F/C → F#/C#).
 * Prefer sharps when going up, flats when going down.
 */
export function transposeChordName(name: string, semitones: number): string {
  if (!name || semitones === 0) return name

  const slash = name.indexOf("/")
  if (slash >= 0) {
    const top = name.slice(0, slash)
    const bass = name.slice(slash + 1)
    return `${transposeChordName(top, semitones)}/${transposeChordName(bass, semitones)}`
  }

  const parts = splitRootSuffix(name)
  if (!parts) return name

  const idx = NOTE_INDEX[parts.root]
  if (idx === undefined) return name

  const newIdx = (idx + wrapSemitones(semitones)) % 12
  const preferFlats = semitones < 0
  const newRoot = preferFlats ? NOTES_FLAT[newIdx] : NOTES_SHARP[newIdx]
  return `${newRoot}${parts.suffix}`
}

function transposeBlock(block: Block, semitones: number): Block {
  if (block.type !== "chord" || !block.chord?.name) {
    return {
      ...block,
      chord: block.chord ? { ...block.chord } : undefined,
    }
  }

  const newName = transposeChordName(block.chord.name, semitones)
  const parsed = parseChordName(newName)

  return {
    ...block,
    chord: {
      ...block.chord,
      name: newName,
      ...(parsed?.root != null ? { root: parsed.root } : {}),
      ...(parsed?.suffix != null ? { suffix: parsed.suffix } : {}),
      ...(parsed?.type != null ? { type: parsed.type } : {}),
    },
  }
}

function transposeBar(bar: Bar, semitones: number): Bar {
  return {
    ...bar,
    blocks: bar.blocks.map((b) => transposeBlock(b, semitones)),
  }
}

function transposeSection(section: SongSection, semitones: number): SongSection {
  return {
    ...section,
    bars: section.bars.map((bar) => transposeBar(bar, semitones)),
  }
}

/**
 * Project a song transposed by semitones. Does not mutate the original.
 * Also transposes `mainKey` when present.
 */
export function transposeSong(song: Song, semitones: number): Song {
  return {
    ...song,
    mainKey: song.mainKey
      ? transposeChordName(song.mainKey, semitones)
      : song.mainKey,
    timeSignature: { ...song.timeSignature },
    songSections: song.songSections.map((s) => transposeSection(s, semitones)),
  }
}

/**
 * F16: same projection as `transposeSong`, named for the edit-time “bake as original”
 * intent. Caller replaces the form/draft song with the result and persists on save.
 * Does not mutate the input.
 */
export function bakeTranspose(song: Song, semitones: number): Song {
  return transposeSong(song, semitones)
}
