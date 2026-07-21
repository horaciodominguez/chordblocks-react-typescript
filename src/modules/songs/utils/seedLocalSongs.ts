import { v4 as uuidv4 } from "uuid"
import { idbStorage } from "@/services/storage/providers/storage.idb"
import { songsData } from "@/modules/songs/data/songs"
import type { Song } from "@/modules/songs/types/song.types"
import type { SongSection } from "@/modules/songs/types/section.types"
import type { Bar } from "@/modules/songs/types/bar.types"
import type { Block } from "@/modules/songs/types/block.types"

export type EnsureLocalOptions = {
  /**
   * When true (logged-in), never seed mockups into an empty IDB.
   * Caller must pull from Supabase first; seed only if remote is also empty.
   */
  hasSession?: boolean
}

/** Deep-clone a template song with fresh UUIDs (avoids global PK collisions). */
export function cloneSongWithNewIds(template: Song): Song {
  const songSections: SongSection[] = template.songSections.map((section) => {
    const bars: Bar[] = section.bars.map((bar) => {
      const blocks: Block[] = bar.blocks.map((block) => ({
        ...block,
        id: uuidv4(),
        chord: block.chord ? { ...block.chord } : undefined,
      }))
      return { ...bar, id: uuidv4(), blocks }
    })
    return { ...section, id: uuidv4(), bars }
  })

  return {
    ...template,
    id: uuidv4(),
    seedOriginId: template.seedOriginId ?? template.id,
    imageUrl: template.imageUrl ?? null,
    imageBase64: template.imageBase64 ?? null,
    timeSignature: { ...template.timeSignature },
    songSections,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  }
}

/**
 * Ensure local songs exist for anonymous/demo use.
 * - Non-empty IDB → return as-is (never re-seed).
 * - Empty + session → return [] (do not seed; sync should hydrate from remote).
 * - Empty + no session → seed cloned mockups into songs + pending (fresh UUIDs).
 */
export async function ensureLocalSongs(
  options: EnsureLocalOptions = {},
): Promise<Song[]> {
  const dbSongs = await idbStorage.getSongs()

  if (dbSongs && dbSongs.length > 0) {
    return dbSongs
  }

  if (options.hasSession) {
    return []
  }

  const clones = songsData.map(cloneSongWithNewIds)
  for (const s of clones) {
    await idbStorage.saveSong(s)
    await idbStorage.addPending(s)
  }

  return clones
}

/** @deprecated use ensureLocalSongs */
export async function seedLocalSongsIfEmpty(): Promise<Song[]> {
  return ensureLocalSongs({ hasSession: false })
}

/**
 * Seed mockups only when both local and remote are empty (brand-new account).
 */
export async function seedIfRemoteAlsoEmpty(
  remoteSongs: Song[],
): Promise<Song[]> {
  const local = await idbStorage.getSongs()
  if (local.length > 0) return local
  if (remoteSongs.length > 0) return local

  return ensureLocalSongs({ hasSession: false })
}
