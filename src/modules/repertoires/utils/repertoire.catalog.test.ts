import { describe, expect, it } from "vitest"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import type { Song } from "@/modules/songs/types/song.types"
import {
  compareRepertoiresByDate,
  filterRepertoires,
  findRepertoiresReferencingSong,
  getPinnedRepertoires,
  getUnpinnedRepertoires,
  sortRepertoiresByDate,
} from "./repertoire.catalog"

function rep(
  partial: Partial<Repertoire> & Pick<Repertoire, "id" | "title">,
): Repertoire {
  return {
    groups: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...partial,
  }
}

function song(id: string, title: string, artist: string): Song {
  return {
    id,
    title,
    artist,
    genre: "Rock",
    year: 2000,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  }
}

describe("repertoire.catalog", () => {
  it("sorts by date desc with missing dates last", () => {
    const reps = [
      rep({ id: "1", title: "No date", updatedAt: "2024-06-01T00:00:00.000Z" }),
      rep({ id: "2", title: "Older", date: "2024-01-10" }),
      rep({ id: "3", title: "Newer", date: "2024-03-10" }),
    ]
    expect(sortRepertoiresByDate(reps).map((r) => r.id)).toEqual([
      "3",
      "2",
      "1",
    ])
    expect(compareRepertoiresByDate(reps[2], reps[1])).toBeLessThan(0)
  })

  it("splits pinned and unpinned", () => {
    const reps = [
      rep({ id: "a", title: "A", isPinned: true, date: "2024-01-01" }),
      rep({ id: "b", title: "B", isPinned: false }),
      rep({ id: "c", title: "C", isPinned: true, date: "2024-02-01" }),
    ]
    expect(getPinnedRepertoires(reps).map((r) => r.id)).toEqual(["c", "a"])
    expect(getUnpinnedRepertoires(reps).map((r) => r.id)).toEqual(["b"])
  })

  it("filters by set title, song title and artist", () => {
    const songs = [
      song("s1", "Valerie", "Amy Winehouse"),
      song("s2", "Billie Jean", "Michael Jackson"),
    ]
    const reps = [
      rep({
        id: "r1",
        title: "English night",
        groups: [
          {
            id: "g1",
            title: "",
            items: [
              { id: "i1", songId: "s1", transposeSemitones: 0 },
            ],
          },
        ],
      }),
      rep({
        id: "r2",
        title: "Latinos",
        groups: [
          {
            id: "g2",
            title: "",
            items: [
              { id: "i2", songId: "s2", transposeSemitones: 0 },
            ],
          },
        ],
      }),
    ]
    expect(filterRepertoires(reps, "english", songs).map((r) => r.id)).toEqual([
      "r1",
    ])
    expect(filterRepertoires(reps, "valerie", songs).map((r) => r.id)).toEqual([
      "r1",
    ])
    expect(filterRepertoires(reps, "michael", songs).map((r) => r.id)).toEqual([
      "r2",
    ])
  })

  it("finds sets referencing a song", () => {
    const reps = [
      rep({
        id: "r1",
        title: "A",
        groups: [
          {
            id: "g1",
            title: "",
            items: [{ id: "i1", songId: "s1", transposeSemitones: 0 }],
          },
        ],
      }),
      rep({ id: "r2", title: "B", groups: [] }),
    ]
    expect(findRepertoiresReferencingSong(reps, "s1").map((r) => r.id)).toEqual(
      ["r1"],
    )
  })
})
