export const SECTION_OPTIONS = [
  "INTRO",
  "VERSE",
  "PRE-CHORUS",
  "CHORUS",
  "BRIDGE",
  "INSTRUMENTAL",
  "OUTRO",
] as const

export const BEAT_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export const noteValues = [2, 4, 8] as const

/** Common chart reference keys (major + minor). */
const MAIN_KEY_ROOTS = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
] as const

export const MAIN_KEY_OPTIONS = [
  ...MAIN_KEY_ROOTS,
  ...MAIN_KEY_ROOTS.map((root) => `${root}m`),
] as const
