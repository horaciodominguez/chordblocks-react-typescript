import { SongSchema, type SongParsed } from "@/modules/songs/schemas/song.schema"
import type { Song } from "@/modules/songs/types/song.types"
import { isDevDebug } from "@/utils/devLog"

export type ParseStoredSongResult =
  | { ok: true; song: Song }
  | { ok: false; error: string }

const warnedInvalidSongs = new Set<string>()

function formatIssues(raw: unknown): string {
  const res = SongSchema.safeParse(raw)
  if (res.success) return ""
  return res.error.issues
    .slice(0, 5)
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ")
}

/**
 * Validate a song document from IDB / Supabase / import payload.
 * Returns null when corrupt — never throws.
 * Warns once per id (or when chordblocks:debug is on) to avoid console spam.
 */
export function parseStoredSong(
  raw: unknown,
  source = "storage",
): Song | null {
  const res = SongSchema.safeParse(raw)
  if (res.success) {
    return res.data as Song
  }
  const id =
    raw && typeof raw === "object" && "id" in raw
      ? String((raw as { id: unknown }).id)
      : "?"
  const key = `${source}:${id}`
  if (isDevDebug() || !warnedInvalidSongs.has(key)) {
    warnedInvalidSongs.add(key)
    console.warn(
      `[${source}] skipping invalid song ${id}:`,
      formatIssues(raw),
    )
  }
  return null
}

/** Parse many song documents; drops invalid ones. */
export function parseStoredSongs(
  rows: unknown[],
  source = "storage",
): Song[] {
  const songs: Song[] = []
  for (const row of rows) {
    const song = parseStoredSong(row, source)
    if (song) songs.push(song)
  }
  return songs
}

export function parseStoredSongResult(raw: unknown): ParseStoredSongResult {
  const res = SongSchema.safeParse(raw)
  if (res.success) {
    return { ok: true, song: res.data as Song }
  }
  return { ok: false, error: formatIssues(raw) }
}

export type { SongParsed }
