import shapes from "@/modules/chords/data/chordShapes.generated.json"
import { resolveDiagramSpriteId } from "@/modules/chords/data/chordFingerings"
import { fretsToMidi } from "@/modules/chords/audio/fretToMidi"
import { splitRootSuffix } from "@/modules/chords/data/chordFingerings"

type Shape = {
  frets: (number | null)[]
  baseFret: number
}

const SHAPES = shapes as Record<string, Shape>

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
}

/** Fallback triad/seventh when no curated shape exists. */
function chordNameToMidiFallback(chordName: string): number[] {
  const slash = chordName.indexOf("/")
  const top = slash >= 0 ? chordName.slice(0, slash) : chordName
  const parsed = splitRootSuffix(top)
  if (!parsed) return [60, 64, 67]

  const rootIdx = NOTE_INDEX[parsed.root]
  if (rootIdx == null) return [60, 64, 67]

  const s = parsed.suffix.toLowerCase()
  let intervals = [0, 4, 7]
  if (s === "m" || s === "min") intervals = [0, 3, 7]
  else if (s.includes("m7") && !s.includes("maj")) intervals = [0, 3, 7, 10]
  else if (s.includes("maj7") || s === "7" || s.includes("7")) {
    intervals = s.includes("maj7") ? [0, 4, 7, 11] : [0, 4, 7, 10]
  } else if (s.includes("dim")) intervals = [0, 3, 6]
  else if (s.includes("aug")) intervals = [0, 4, 8]
  else if (s.includes("sus4")) intervals = [0, 5, 7]
  else if (s.includes("sus2")) intervals = [0, 2, 7]

  const rootMidi = 48 + rootIdx
  return intervals.map((i) => rootMidi + i)
}

/** MIDI notes for preview — curated shape first, else interval fallback. */
export function chordPreviewMidiNotes(
  chordName: string,
  voicing = 0,
): number[] {
  const spriteId = resolveDiagramSpriteId(chordName, voicing)
  const shape = SHAPES[spriteId]
  if (shape?.frets?.length) {
    const notes = fretsToMidi(shape.frets)
    if (notes.length > 0) return notes
  }
  return chordNameToMidiFallback(chordName)
}
