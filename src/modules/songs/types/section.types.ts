import { SECTION_OPTIONS } from "@/modules/songs/constants/song"

import type { Bar } from "./bar.types"

export type SectionType = (typeof SECTION_OPTIONS)[number]

export interface SongSection {
  id: string
  type: SectionType
  /** Keep-like name for the part (e.g. "A", "Riff 1"). Optional. */
  label?: string
  bars: Bar[]
  repeats: number
}

export type PendingSectionType = SectionType | ""

export interface PendingSongSection {
  id: string
  type: PendingSectionType
  label?: string
  bars: Bar[]
  repeats: number
}
