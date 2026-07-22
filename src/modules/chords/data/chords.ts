import { type Chord } from "../types/chord.types"

export const ROOTS = ["C", "D", "E", "F", "G", "A", "B"] as const

export const ACCIDENTALS = [
  { value: "natural", label: "♮", suffix: "" },
  { value: "sharp", label: "#", suffix: "#" },
  { value: "flat", label: "b", suffix: "b" },
] as const

export const VARIATIONS = [
  { suffix: "", type: "major" },
  { suffix: "m", type: "minor" },
  { suffix: "5", type: "power" },
  { suffix: "6", type: "sixth" },
  { suffix: "m6", type: "minorSixth" },
  { suffix: "7", type: "dominant7" },
  { suffix: "m7", type: "minor7" },
  { suffix: "maj7", type: "major7" },
  { suffix: "dim", type: "diminished" },
  { suffix: "dim7", type: "diminished7" },
  { suffix: "aug", type: "augmented" },
  { suffix: "m7b5", type: "halfDiminished" },
  { suffix: "9", type: "dominant9" },
  { suffix: "m9", type: "minor9" },
  { suffix: "maj9", type: "major9" },
  { suffix: "add9", type: "add9" },
  { suffix: "sus2", type: "sus2" },
  { suffix: "sus4", type: "sus4" },
  { suffix: "7sus4", type: "dominant7sus4" },
] as const

export const chordsData = ROOTS.reduce<Record<string, Chord[]>>((acc, root) => {
  acc[root] = VARIATIONS.map((v) => ({
    name: `${root}${v.suffix}`,
    root,
    type: v.type,
    suffix: v.suffix,
  }))
  return acc
}, {})
