import { SECTION_OPTIONS } from "@/modules/songs/constants/song"

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




