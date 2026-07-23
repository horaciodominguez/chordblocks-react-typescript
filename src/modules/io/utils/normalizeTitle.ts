/** Normalize song title for duplicate detection. */
export function normalizeSongTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Normalize artist for duplicate detection (same rules as title). */
export function normalizeArtist(artist: string): string {
  return artist.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Content identity key: normalized title + artist. */
export function songIdentityKey(title: string, artist: string): string {
  return `${normalizeSongTitle(title)}\0${normalizeArtist(artist)}`
}

export function songContentKey(song: {
  title: string
  artist: string
}): string {
  return songIdentityKey(song.title, song.artist)
}
