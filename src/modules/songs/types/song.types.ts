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

  /** YouTube link used as listening reference (raw URL as entered). Optional. */
  youtubeUrl?: string

  /**
   * Stable id of the mockup template this song was cloned from.
   * Used to reconcile the same demo song across devices (different UUIDs).
   */
  seedOriginId?: string

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
