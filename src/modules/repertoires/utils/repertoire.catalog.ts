import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import type { Song } from "@/modules/songs/types/song.types"
import { normalizeText } from "@/modules/songs/utils/songCatalog"

/** Sort: date desc, missing dates last, updatedAt as stable tiebreaker. */
export function compareRepertoiresByDate(a: Repertoire, b: Repertoire): number {
  const aDate = a.date?.trim() || ""
  const bDate = b.date?.trim() || ""
  if (aDate && bDate) {
    const byDate = bDate.localeCompare(aDate)
    if (byDate !== 0) return byDate
  } else if (aDate && !bDate) {
    return -1
  } else if (!aDate && bDate) {
    return 1
  }
  return (
    b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title)
  )
}

export function sortRepertoiresByDate(reps: Repertoire[]): Repertoire[] {
  return [...reps].sort(compareRepertoiresByDate)
}

export function getPinnedRepertoires(reps: Repertoire[]): Repertoire[] {
  return sortRepertoiresByDate(reps.filter((r) => Boolean(r.isPinned)))
}

export function getUnpinnedRepertoires(reps: Repertoire[]): Repertoire[] {
  return sortRepertoiresByDate(reps.filter((r) => !r.isPinned))
}

function repertoireMatchesQuery(
  rep: Repertoire,
  query: string,
  songById: Map<string, Song>,
): boolean {
  if (normalizeText(rep.title).includes(query)) return true
  for (const group of rep.groups) {
    for (const item of group.items) {
      const song = songById.get(item.songId)
      if (!song) continue
      if (
        normalizeText(song.title).includes(query) ||
        normalizeText(song.artist).includes(query)
      ) {
        return true
      }
    }
  }
  return false
}

export function filterRepertoires(
  reps: Repertoire[],
  search: string,
  songs: Song[],
): Repertoire[] {
  const query = normalizeText(search)
  if (!query) return reps
  const songById = new Map(songs.map((s) => [s.id, s]))
  return reps.filter((rep) => repertoireMatchesQuery(rep, query, songById))
}

export function countRepertoireItems(rep: Repertoire): number {
  return rep.groups.reduce((n, g) => n + g.items.length, 0)
}

export function formatRepertoireDate(date?: string): string | null {
  const value = date?.trim()
  return value || null
}

export function findRepertoiresReferencingSong(
  reps: Repertoire[],
  songId: string,
): Repertoire[] {
  return reps.filter((rep) =>
    rep.groups.some((g) => g.items.some((i) => i.songId === songId)),
  )
}
