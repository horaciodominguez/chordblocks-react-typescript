
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
  chords: SongChord[]
}

export type SectionType = typeof SECTION_OPTIONS[number]

export interface SongChord {
  name: string
  beats: number
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
]

export const beatsPerMeasureValues = [1, 2, 3, 4, 6]

export const noteValues = [2, 4, 8]


