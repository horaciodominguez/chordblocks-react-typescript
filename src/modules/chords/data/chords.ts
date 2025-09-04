import { type Chord } from "../types/chord.types"

// chords.ts
export const ROOTS = [
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

export const VARIATIONS = [
  { suffix: "", type: "major" },
  /* { suffix: "m", type: "minor" },
  { suffix: "7", type: "dominant7" },
  { suffix: "m7", type: "minor7" },
  { suffix: "maj7", type: "major7" },
  { suffix: "9", type: "dominant9" },
  { suffix: "sus2", type: "sus2" },
  { suffix: "sus4", type: "sus4" }, */
] as const

// Genera todas las combinaciones raíz + variación
export const chordsData = ROOTS.reduce<Record<string, Chord[]>>((acc, root) => {
  acc[root] = VARIATIONS.map((v) => ({
    name: `${root}${v.suffix}`,
    root,
    type: v.type,
    svgId: `${root}${v.suffix}`, // id en el sprite SVG
  }))
  return acc
}, {})
