import { idbStorage } from "@/services/storage/providers/storage.idb"
import { songsData } from "@/modules/songs/data/songs"
import type { Song } from "@/modules/songs/types/song.types"

export type EnsureLocalOptions = {
  /**
   * When true (logged-in), never seed mockups into an empty IDB.
   * Caller must pull from Supabase first; seed only if remote is also empty.
   */
  hasSession?: boolean
}

/**
 * Ensure local songs exist for anonymous/demo use.
 * - Non-empty IDB → return as-is (never re-seed).
 * - Empty + session → return [] (do not seed; sync should hydrate from remote).
 * - Empty + no session → seed mockups into songs + pending.
 */
export async function ensureLocalSongs(
  options: EnsureLocalOptions = {},
): Promise<Song[]> {
  let dbSongs = await idbStorage.getSongs()

  if (dbSongs && dbSongs.length > 0) {
    return dbSongs
  }

  if (options.hasSession) {
    return []
  }

  for (const s of songsData) {
    await idbStorage.saveSong(s)
    await idbStorage.addPending(s)
  }

  return songsData
}

/** @deprecated use ensureLocalSongs — kept for call-site clarity during migration */
export async function seedLocalSongsIfEmpty(): Promise<Song[]> {
  return ensureLocalSongs({ hasSession: false })
}

/**
 * Seed mockups only when both local and the provided remote list are empty
 * (brand-new account with nothing in the cloud yet).
 */
export async function seedIfRemoteAlsoEmpty(
  remoteSongs: Song[],
): Promise<Song[]> {
  const local = await idbStorage.getSongs()
  if (local.length > 0) return local
  if (remoteSongs.length > 0) return local

  return ensureLocalSongs({ hasSession: false })
}
