import { describe, expect, it } from "vitest"
import { SongSchema } from "@/modules/songs/schemas/song.schema"

describe("SongSchema cueTime", () => {
  const baseSong = {
    id: "s1",
    title: "Test",
    artist: "Artist",
    genre: "Rock",
    year: 2000,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    imageUrl: null,
    imageBase64: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }

  const section = {
    id: "sec-1",
    type: "VERSE" as const,
    repeats: 1,
    bars: [
      {
        id: "bar-1",
        position: 1,
        blocks: [
          {
            id: "b1",
            type: "chord" as const,
            chord: { name: "C" },
            duration: 4,
            position: 1,
          },
        ],
      },
    ],
  }

  it("accepts section cueTime", () => {
    const result = SongSchema.safeParse({
      ...baseSong,
      songSections: [{ ...section, cueTime: 82 }],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.songSections[0].cueTime).toBe(82)
    }
  })

  it("accepts sections without cueTime", () => {
    const result = SongSchema.safeParse({
      ...baseSong,
      songSections: [section],
    })
    expect(result.success).toBe(true)
  })
})
