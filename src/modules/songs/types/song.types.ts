import type { SongSection } from "./section.types"

export interface Song {
  id: string
  title: string
  author: string
  timeSignature: TimeSignature
  songSections: SongSection[]
}

export interface TimeSignature {
  beatsPerMeasure: number
  noteValue: number
}
