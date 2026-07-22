/**
 * Chord fingering catalog metadata (sprite is generated offline).
 * Fingerings live in scripts/chordFingerings.mjs; this module mirrors
 * the catalog for tests and documentation.
 */
export const CHROMATIC_ROOTS = [
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

export const FLAT_ALIASES = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
} as const

/** Must stay in sync with scripts/chordFingerings.mjs SUFFIXES and VARIATIONS in chords.ts */
export const SPRITE_SUFFIXES = [
  "",
  "m",
  "5",
  "6",
  "m6",
  "7",
  "m7",
  "maj7",
  "dim",
  "dim7",
  "aug",
  "m7b5",
  "9",
  "m9",
  "maj9",
  "add9",
  "sus2",
  "sus4",
  "7sus4",
] as const

export function expectedSpriteChordIds(): string[] {
  const ids: string[] = []
  for (const root of CHROMATIC_ROOTS) {
    for (const suffix of SPRITE_SUFFIXES) {
      ids.push(`${root}${suffix}`)
    }
  }
  for (const flat of Object.keys(FLAT_ALIASES)) {
    for (const suffix of SPRITE_SUFFIXES) {
      ids.push(`${flat}${suffix}`)
    }
  }
  return ids
}
