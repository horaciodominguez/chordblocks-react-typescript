import type { Song } from "@/modules/songs/types/song.types"

export type SongSort =
  | "title-asc"
  | "artist-asc"
  | "updated-desc"
  | "year-desc"

export type ArtistGroup = {
  key: string
  displayName: string
  songs: Song[]
  letter: string
}

/** Normalize for search/group keys without mutating displayed text. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

export function normalizeArtistKey(artist: string): string {
  const key = normalizeText(artist)
  return key || "unknown"
}

export function artistDisplayName(artist: string): string {
  const trimmed = artist.trim()
  return trimmed || "Unknown artist"
}

export function artistLetter(artist: string): string {
  const key = normalizeArtistKey(artist)
  if (key === "unknown") return "#"
  const first = key.charAt(0).toUpperCase()
  return /[A-Z]/.test(first) ? first : "#"
}

export function compareSongs(a: Song, b: Song, sort: SongSort): number {
  switch (sort) {
    case "title-asc":
      return (
        normalizeText(a.title).localeCompare(normalizeText(b.title)) ||
        a.id.localeCompare(b.id)
      )
    case "artist-asc": {
      const byArtist = normalizeArtistKey(a.artist).localeCompare(
        normalizeArtistKey(b.artist),
      )
      if (byArtist !== 0) return byArtist
      return normalizeText(a.title).localeCompare(normalizeText(b.title))
    }
    case "year-desc":
      return b.year - a.year || normalizeText(a.title).localeCompare(normalizeText(b.title))
    case "updated-desc":
    default:
      return (
        b.updatedAt.localeCompare(a.updatedAt) ||
        normalizeText(a.title).localeCompare(normalizeText(b.title))
      )
  }
}

export function filterSongs(
  songs: Song[],
  opts: {
    search?: string
    year?: string
    genre?: string
    artistKey?: string
  },
): Song[] {
  const search = normalizeText(opts.search ?? "")
  return songs.filter((song) => {
    if (opts.artistKey && normalizeArtistKey(song.artist) !== opts.artistKey) {
      return false
    }
    if (opts.year && song.year.toString() !== opts.year) return false
    if (opts.genre && song.genre !== opts.genre) return false
    if (!search) return true
    return (
      normalizeText(song.title).includes(search) ||
      normalizeText(song.artist).includes(search)
    )
  })
}

export function sortSongs(songs: Song[], sort: SongSort): Song[] {
  return [...songs].sort((a, b) => compareSongs(a, b, sort))
}

export function groupSongsByArtist(songs: Song[]): ArtistGroup[] {
  const map = new Map<string, ArtistGroup>()
  for (const song of songs) {
    const key = normalizeArtistKey(song.artist)
    const existing = map.get(key)
    if (existing) {
      existing.songs.push(song)
    } else {
      map.set(key, {
        key,
        displayName: artistDisplayName(song.artist),
        songs: [song],
        letter: artistLetter(song.artist),
      })
    }
  }
  return [...map.values()]
    .map((group) => ({
      ...group,
      songs: sortSongs(group.songs, "title-asc"),
    }))
    .sort((a, b) => {
      if (a.key === "unknown") return 1
      if (b.key === "unknown") return -1
      return a.displayName.localeCompare(b.displayName, undefined, {
        sensitivity: "base",
      })
    })
}

export function getArtistIndex(groups: ArtistGroup[]): string[] {
  const letters = new Set(groups.map((g) => g.letter))
  const az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const present = az.filter((l) => letters.has(l))
  if (letters.has("#")) present.push("#")
  return present
}
