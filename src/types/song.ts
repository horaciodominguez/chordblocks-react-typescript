
export interface Song {
  id: string
  title: string
  author: string
  timeSignature: TimeSignature
  songSections: SongSection[]
}

export interface Chord {
  name: string
  beats: number
}

export interface ChordBlock {
  chords: Chord[]
}

export interface SongSection {
  id: string
  type: SectionType
  blocks: ChordBlock[]
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

export type SectionType = typeof SECTION_OPTIONS[number]


