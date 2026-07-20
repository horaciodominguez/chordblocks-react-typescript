import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

export const CHORD_BLOCKS_EXPORT_VERSION = 1 as const

export interface ChordBlocksExport {
  version: typeof CHORD_BLOCKS_EXPORT_VERSION
  exportedAt: string
  songs: Song[]
  repertoires?: Repertoire[]
}

export type SongConflictAction = "skip" | "duplicate" | "replace"

export type SongImportResolution = {
  packageSongId: string
  action: SongConflictAction
}
