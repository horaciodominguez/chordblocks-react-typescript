import type { SongSection } from "./section.types"

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  year: number
  timeSignature: TimeSignature

  /** Reference key of the chart as written (transpose anchor). Optional. */
  mainKey?: string

  imageUrl?: string | null // Supabase
  imageBase64?: string | null // Local only

  songSections: SongSection[]
  createdAt: string
  updatedAt: string
}

export interface TimeSignature {
  beatsPerMeasure: number
  noteValue: number
}
