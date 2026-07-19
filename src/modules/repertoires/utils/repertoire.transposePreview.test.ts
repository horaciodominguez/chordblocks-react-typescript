import { describe, expect, it } from "vitest"
import type { Song } from "@/modules/songs/types/song.types"
import {
  formatSemitoneOffset,
  formatTransposePreview,
  getSongKeyAnchor,
} from "./repertoire.transposePreview"
import { setItemTranspose, setItemNotes } from "./repertoire.edit"
import type { Repertoire } from "../types/repertoire.types"

function songWithKey(mainKey?: string, firstChord?: string): Song {
  return {
    id: "s1",
    title: "Human Nature",
    artist: "MJ",
    year: 1982,
    genre: "Pop",
    mainKey,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: firstChord
      ? [
          {
            id: "sec1",
            type: "VERSE",
            repeats: 1,
            bars: [
              {
                id: "b1",
                position: 0,
                blocks: [
                  {
                    id: "c1",
                    type: "chord",
                    duration: 4,
                    position: 0,
                    chord: { name: firstChord },
                  },
                ],
              },
            ],
          },
        ]
      : [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }
}

describe("repertoire.transposePreview", () => {
  it("prefers mainKey over first chord", () => {
    expect(getSongKeyAnchor(songWithKey("Bm", "D"))).toBe("Bm")
  })

  it("falls back to first chord", () => {
    expect(getSongKeyAnchor(songWithKey(undefined, "D"))).toBe("D")
  })

  it("formats preview with key change", () => {
    expect(formatTransposePreview(songWithKey("Bm"), 1)).toBe("+1 · Bm → Cm")
    expect(formatTransposePreview(songWithKey("Bm"), 0)).toBeNull()
    expect(formatSemitoneOffset(-2)).toBe("-2")
  })
})

describe("setItemTranspose", () => {
  it("updates and clamps transpose on an item", () => {
    const rep: Repertoire = {
      id: "r1",
      title: "Gig",
      groups: [
        {
          id: "g1",
          title: "",
          items: [
            { id: "i1", songId: "s1", transposeSemitones: 0 },
          ],
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }

    const next = setItemTranspose(rep, "i1", 1)
    expect(next.groups[0].items[0].transposeSemitones).toBe(1)
    expect(rep.groups[0].items[0].transposeSemitones).toBe(0)

    expect(setItemTranspose(rep, "i1", 99).groups[0].items[0].transposeSemitones).toBe(
      12,
    )
  })
})

describe("setItemNotes", () => {
  it("sets and clears notes on an item", () => {
    const rep: Repertoire = {
      id: "r1",
      title: "Gig",
      groups: [
        {
          id: "g1",
          title: "",
          items: [{ id: "i1", songId: "s1", transposeSemitones: 0 }],
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }

    const withNotes = setItemNotes(rep, "i1", "tono B")
    expect(withNotes.groups[0].items[0].notes).toBe("tono B")

    const cleared = setItemNotes(withNotes, "i1", "")
    expect(cleared.groups[0].items[0].notes).toBeUndefined()
  })
})
