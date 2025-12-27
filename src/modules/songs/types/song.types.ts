import type { SongSection } from "./section.types"

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  year: number
  timeSignature: TimeSignature

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
