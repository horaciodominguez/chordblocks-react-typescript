import { chordsData } from "@/modules/chords/data/chords"
import type { Chord } from "@/modules/chords/types/chord.types"

export const chordWidth = (duration: number, beatsPerMeasure: number): string =>
  `${(duration / beatsPerMeasure) * 100}%`

export function getChordByName(name?: string | null): Chord | null {
  if (!name) return null

  for (const root in chordsData) {
    const found = chordsData[root].find((chord) => chord.name === name)
    if (found) return found
  }

  return null
}

export function parseChordName(name?: string | null): Chord | null {
  if (!name) return null
  const found = getChordByName(name)
  if (found) return found

  const m = name.match(/^([A-G][#b]?)(.*)$/)
  return {
    name,
    root: m ? m[1] : name,
    suffix: m ? m[2]?.trim() ?? "" : "",
    type: "custom",
  } as Chord
}
