
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
  id: string
  name: string
  duration: number
}

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
] as const

export const beatsPerMeasureValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export const noteValues = [2, 4, 8] as const


