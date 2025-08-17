
export interface Song {
  id: string
  title: string
  author: string
  timeSignature: TimeSignature
  songSections: SongSection[]
}

export interface SongSection {
  id: string
  type: SectionType
  bars: Bar[]
}

export type SectionType = typeof SECTION_OPTIONS[number]

export interface Bar {
  id: string
  chords: BarChord[] 
}

export interface BarChord {
  id: string                // id único para keys estables en render
  name: string              // nombre del acorde, p.ej. "E", "C#m", "B/#D"
  duration: number          // duración en beats (entero positivo). Ej: 4 = redonda en 4/4
}

/* export interface SongChord {
  name: string
  beats: number
} */

export interface TimeSignature {
  beatsPerMeasure: number
  noteValue: number
}

export const SECTION_OPTIONS = [
  "INTRO",
  "VERSE",
  "PRE-CHORUS",
  "CHORUS",
  "BRIDGE",
  "INSTRUMENTAL",
  "OUTRO"
]

export const beatsPerMeasureValues = [1, 2, 3, 4, 6]

export const noteValues = [2, 4, 8]


