import { chordsData } from "@/modules/chords/data/chords"
import type { Chord } from "@/modules/chords/types/chord.types"
import type { CSSProperties } from "react"

/** Flex share of a bar by beat duration (e.g. 3 + 1 in 4/4 → 3:1). */
export const chordFlexStyle = (
  duration: number,
  options?: { guide?: boolean },
): CSSProperties => {
  const beats = Math.max(1, duration)
  if (options?.guide) {
    // Atril: keep proportional share but never crush glyphs under bar lines.
    return {
      flex: `${beats} 1 auto`,
      minWidth: `max(${beats * 1.35}rem, max-content)`,
    }
  }
  return {
    flex: `${beats} 1 0%`,
    minWidth: 0,
  }
}

/** Fixed width for drag overlay (portal has no bar parent). */
export const chordOverlayWidth = (duration: number): string =>
  `${Math.max(3.5, duration * 2.25)}rem`

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
    suffix: m ? (m[2]?.trim() ?? "") : "",
    type: "custom",
  } as Chord
}
