import { describe, expect, it } from "vitest"
import {
  countSongBeats,
  estimateSongDurationSeconds,
} from "@/modules/songs/utils/songTiming"
import type { Song } from "@/modules/songs/types/song.types"

function songWithBeats(beatsPerBar: number, bars: number, repeats = 1): Song {
  return {
    id: "s",
    title: "t",
    artist: "a",
    genre: "g",
    year: 2020,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    imageUrl: null,
    imageBase64: null,
    createdAt: "",
    updatedAt: "",
    songSections: [
      {
        id: "sec",
        type: "VERSE",
        repeats,
        bars: Array.from({ length: bars }, (_, i) => ({
          id: `b${i}`,
          position: i + 1,
          blocks: [
            {
              id: `bl${i}`,
              type: "chord" as const,
              chord: { name: "C" },
              duration: beatsPerBar,
              position: 1,
            },
          ],
        })),
      },
    ],
  }
}

describe("songTiming", () => {
  it("counts beats with section repeats", () => {
    expect(countSongBeats(songWithBeats(4, 2, 2))).toBe(16)
  })

  it("estimates duration from bpm", () => {
    expect(estimateSongDurationSeconds(16, 120)).toBe(8)
  })
})
