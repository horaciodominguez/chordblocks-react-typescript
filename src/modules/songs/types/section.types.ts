import { SECTION_OPTIONS } from "@/modules/songs/constants/song"

import type { Bar } from "./bar.types"
import type { TimeSignature } from "./song.types"

export type SectionType = (typeof SECTION_OPTIONS)[number]

export interface SongSection {
  id: string
  type: SectionType
  /** Keep-like name for the part (e.g. "A", "Riff 1"). Optional. */
  label?: string
  bars: Bar[]
  repeats: number
  /**
   * Wall-clock cue for Play auto-scroll (seconds from song/video t=0).
   * Optional — unmarked sections are skipped; scroll stops at the last cue.
   */
  cueTime?: number
  /** Optional meter override; omit to use Song.timeSignature. */
  timeSignature?: TimeSignature
  /**
   * Anacrusis: first bar capacity in beats (1 … meter-1).
   * Omit for a full first measure.
   */
  pickupBeats?: number
}

export type PendingSectionType = SectionType | ""

export interface PendingSongSection {
  id: string
  type: PendingSectionType
  label?: string
  bars: Bar[]
  repeats: number
  cueTime?: number
  timeSignature?: TimeSignature
  pickupBeats?: number
}
