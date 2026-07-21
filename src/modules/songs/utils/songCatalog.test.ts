import { describe, expect, it } from "vitest"
import type { Song } from "@/modules/songs/types/song.types"
import {
  artistDisplayName,
  artistLetter,
  filterSongs,
  getArtistIndex,
  groupSongsByArtist,
  normalizeArtistKey,
  normalizeText,
  sortSongs,
} from "./songCatalog"

function song(partial: Partial<Song> & Pick<Song, "id" | "title" | "artist">): Song {
  return {
    genre: "Rock",
    year: 2000,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...partial,
  }
}

describe("songCatalog", () => {
  it("normalizes accents and whitespace", () => {
    expect(normalizeText("  José   María ")).toBe("jose maria")
    expect(normalizeArtistKey("The Beatles")).toBe("the beatles")
    expect(normalizeArtistKey("   ")).toBe("unknown")
    expect(artistDisplayName("  ")).toBe("Unknown artist")
    expect(artistLetter("Áerosmith")).toBe("A")
    expect(artistLetter("")).toBe("#")
  })

  it("filters by search, year, genre and artist key", () => {
    const songs = [
      song({ id: "1", title: "Valerie", artist: "Amy Winehouse", year: 2007, genre: "Soul" }),
      song({ id: "2", title: "Human Nature", artist: "Michael Jackson", year: 1982, genre: "Pop" }),
    ]
    expect(filterSongs(songs, { search: "valerie" })).toHaveLength(1)
    expect(filterSongs(songs, { search: "amy" })).toHaveLength(1)
    expect(filterSongs(songs, { year: "1982" })).toHaveLength(1)
    expect(filterSongs(songs, { genre: "Soul" })).toHaveLength(1)
    expect(
      filterSongs(songs, { artistKey: normalizeArtistKey("Amy Winehouse") }),
    ).toHaveLength(1)
  })

  it("sorts and groups by artist", () => {
    const songs = [
      song({
        id: "b",
        title: "B",
        artist: "Zeta",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }),
      song({
        id: "a",
        title: "A",
        artist: "Alpha",
        updatedAt: "2024-02-01T00:00:00.000Z",
      }),
      song({
        id: "c",
        title: "C",
        artist: "alpha",
        updatedAt: "2024-03-01T00:00:00.000Z",
      }),
    ]
    expect(sortSongs(songs, "title-asc").map((s) => s.id)).toEqual([
      "a",
      "b",
      "c",
    ])
    expect(sortSongs(songs, "updated-desc")[0].id).toBe("c")
    const groups = groupSongsByArtist(songs)
    expect(groups).toHaveLength(2)
    expect(groups[0].displayName).toBe("Alpha")
    expect(groups[0].songs).toHaveLength(2)
    expect(getArtistIndex(groups)).toEqual(["A", "Z"])
  })
})
