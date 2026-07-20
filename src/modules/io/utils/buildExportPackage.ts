import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import type { ChordBlocksExport } from "@/modules/io/types/export.types"
import { CHORD_BLOCKS_EXPORT_VERSION } from "@/modules/io/types/export.types"

function collectSongIdsFromRepertoires(repertoires: Repertoire[]): Set<string> {
  const ids = new Set<string>()
  for (const rep of repertoires) {
    for (const group of rep.groups) {
      for (const item of group.items) {
        ids.add(item.songId)
      }
    }
  }
  return ids
}

/**
 * Build a ChordBlocks export package.
 * Songs are deduped by id. When repertoires are included, only referenced songs
 * are pulled from `allSongs` (plus any explicitly listed in `songs`).
 */
export function buildExportPackage(input: {
  songs?: Song[]
  repertoires?: Repertoire[]
  /** Library used to resolve repertoire songId refs */
  allSongs?: Song[]
}): ChordBlocksExport {
  const byId = new Map<string, Song>()

  for (const song of input.songs ?? []) {
    byId.set(song.id, song)
  }

  const repertoires = input.repertoires
  if (repertoires?.length) {
    const needed = collectSongIdsFromRepertoires(repertoires)
    const library = input.allSongs ?? input.songs ?? []
    const libById = new Map(library.map((s) => [s.id, s]))
    for (const id of needed) {
      const song = libById.get(id) ?? byId.get(id)
      if (song) byId.set(id, song)
    }
  }

  const songs = Array.from(byId.values())
  if (songs.length === 0) {
    throw new Error("Export must include at least one song")
  }

  return {
    version: CHORD_BLOCKS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    songs,
    ...(repertoires?.length ? { repertoires } : {}),
  }
}
