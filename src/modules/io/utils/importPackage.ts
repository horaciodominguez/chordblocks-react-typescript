import { v4 as uuidv4 } from "uuid"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import type { ChordBlocksExport } from "@/modules/io/types/export.types"
import type {
  SongConflictAction,
  SongImportResolution,
} from "@/modules/io/types/export.types"
import { ChordBlocksExportSchema } from "@/modules/io/schemas/export.schema"
import { songContentKey } from "@/modules/io/utils/normalizeTitle"
import { cloneSongWithNewIds } from "@/modules/songs/utils/seedLocalSongs"

export type SongConflict = {
  packageSong: Song
  localSong: Song
}

export type PreparedImportSong = {
  packageSongId: string
  /** Song to persist, if any (skip → null) */
  song: Song | null
  /** replace uses update; otherwise add */
  mode: "add" | "update" | "skip"
}

export function parseExportPackage(raw: unknown): ChordBlocksExport {
  return ChordBlocksExportSchema.parse(raw)
}

/** Conflict when normalized title+artist matches (same key as sync). */
export function findSongConflicts(
  packageSongs: Song[],
  localSongs: Song[],
): SongConflict[] {
  const byIdentity = new Map<string, Song>()
  for (const song of localSongs) {
    const key = songContentKey(song)
    if (!byIdentity.has(key)) byIdentity.set(key, song)
  }

  const conflicts: SongConflict[] = []
  for (const packageSong of packageSongs) {
    const local = byIdentity.get(songContentKey(packageSong))
    if (local) {
      conflicts.push({ packageSong, localSong: local })
    }
  }
  return conflicts
}

/** Default resolutions: no conflict → duplicate (add with new ids); conflict → skip until user chooses */
export function defaultResolutions(
  packageSongs: Song[],
  conflicts: SongConflict[],
): SongImportResolution[] {
  const conflictIds = new Set(conflicts.map((c) => c.packageSong.id))
  return packageSongs.map((s) => ({
    packageSongId: s.id,
    action: conflictIds.has(s.id) ? ("skip" as const) : ("duplicate" as const),
  }))
}

function findLocalByIdentity(
  localSongs: Song[],
  packageSong: Song,
): Song | undefined {
  const key = songContentKey(packageSong)
  return localSongs.find((s) => songContentKey(s) === key)
}

/**
 * Prepare songs for persistence and a map from package songId → local songId.
 */
export function prepareSongImports(
  packageSongs: Song[],
  localSongs: Song[],
  resolutions: SongImportResolution[],
): { prepared: PreparedImportSong[]; songIdMap: Map<string, string> } {
  const actionById = new Map(
    resolutions.map((r) => [r.packageSongId, r.action] as const),
  )
  const songIdMap = new Map<string, string>()
  const prepared: PreparedImportSong[] = []

  for (const packageSong of packageSongs) {
    const action: SongConflictAction =
      actionById.get(packageSong.id) ?? "duplicate"
    const local = findLocalByIdentity(localSongs, packageSong)

    if (action === "skip") {
      if (!local) {
        // No local match — treat as duplicate so repertoire remap still works
        const cloned = cloneSongWithNewIds(packageSong)
        const now = new Date().toISOString()
        cloned.createdAt = now
        cloned.updatedAt = now
        prepared.push({
          packageSongId: packageSong.id,
          song: cloned,
          mode: "add",
        })
        songIdMap.set(packageSong.id, cloned.id)
      } else {
        prepared.push({
          packageSongId: packageSong.id,
          song: null,
          mode: "skip",
        })
        songIdMap.set(packageSong.id, local.id)
      }
      continue
    }

    if (action === "replace" && local) {
      const now = new Date().toISOString()
      const updated: Song = {
        ...packageSong,
        id: local.id,
        createdAt: local.createdAt,
        updatedAt: now,
        imageUrl: packageSong.imageUrl ?? null,
        imageBase64: packageSong.imageBase64 ?? null,
      }
      prepared.push({
        packageSongId: packageSong.id,
        song: updated,
        mode: "update",
      })
      songIdMap.set(packageSong.id, local.id)
      continue
    }

    // duplicate (or replace without local)
    const cloned = cloneSongWithNewIds(packageSong)
    const now = new Date().toISOString()
    cloned.createdAt = now
    cloned.updatedAt = now
    prepared.push({
      packageSongId: packageSong.id,
      song: cloned,
      mode: "add",
    })
    songIdMap.set(packageSong.id, cloned.id)
  }

  return { prepared, songIdMap }
}

/** Clone repertoire with fresh ids and remapped songIds. */
export function cloneRepertoireWithSongMap(
  rep: Repertoire,
  songIdMap: Map<string, string>,
): Repertoire {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title: rep.title,
    date: rep.date,
    createdAt: now,
    updatedAt: now,
    groups: rep.groups.map((group) => ({
      id: uuidv4(),
      title: group.title,
      items: group.items.map((item) => ({
        id: uuidv4(),
        songId: songIdMap.get(item.songId) ?? item.songId,
        transposeSemitones: item.transposeSemitones,
        notes: item.notes,
      })),
    })),
  }
}
