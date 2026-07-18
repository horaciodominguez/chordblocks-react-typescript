import { describe, it, expect } from "vitest"
import {
  transposeChordName,
  transposeSong,
} from "@/modules/chords/utils/transpose"
import type { Song } from "@/modules/songs/types/song.types"

function sampleSong(): Song {
  return {
    id: "song-1",
    title: "Human Nature",
    artist: "Michael Jackson",
    genre: "Pop",
    year: 1982,
    mainKey: "Bm",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    imageUrl: null,
    imageBase64: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    songSections: [
      {
        id: "sec-1",
        type: "VERSE",
        label: "A",
        repeats: 1,
        bars: [
          {
            id: "bar-1",
            position: 1,
            blocks: [
              {
                id: "b1",
                type: "chord",
                duration: 4,
                position: 1,
                chord: { name: "Bm" },
              },
            ],
          },
          {
            id: "bar-2",
            position: 2,
            blocks: [
              {
                id: "b2",
                type: "chord",
                duration: 2,
                position: 1,
                chord: { name: "F#m7" },
              },
              {
                id: "b3",
                type: "rest",
                duration: 2,
                position: 2,
              },
            ],
          },
        ],
      },
    ],
  }
}

describe("transposeChordName", () => {
  it("transposes Bm + 1 → Cm", () => {
    expect(transposeChordName("Bm", 1)).toBe("Cm")
  })

  it("transposes C - 1 → B", () => {
    expect(transposeChordName("C", -1)).toBe("B")
  })

  it("preserves suffixes", () => {
    expect(transposeChordName("F#m7", 1)).toBe("Gm7")
    expect(transposeChordName("Gsus4", 2)).toBe("Asus4")
    expect(transposeChordName("Bbmaj7", 1)).toBe("Bmaj7")
  })

  it("prefers flats when going down", () => {
    expect(transposeChordName("C", -2)).toBe("Bb")
    expect(transposeChordName("G", -1)).toBe("Gb")
  })

  it("prefers sharps when going up", () => {
    expect(transposeChordName("C", 1)).toBe("C#")
    expect(transposeChordName("F", 1)).toBe("F#")
  })

  it("transposes slash chords on both sides", () => {
    expect(transposeChordName("F/C", 1)).toBe("F#/C#")
    expect(transposeChordName("D/F#", -1)).toBe("Db/F")
  })

  it("returns the same name for 0 semitones", () => {
    expect(transposeChordName("Am", 0)).toBe("Am")
  })

  it("wraps full octaves", () => {
    expect(transposeChordName("C", 12)).toBe("C")
    expect(transposeChordName("C", -12)).toBe("C")
    expect(transposeChordName("Bm", 13)).toBe("Cm")
  })

  it("leaves unparseable names unchanged", () => {
    expect(transposeChordName("N.C.", 1)).toBe("N.C.")
    expect(transposeChordName("", 1)).toBe("")
  })
})

describe("transposeSong", () => {
  it("projects all chord names and mainKey without mutating the original", () => {
    const original = sampleSong()
    const originalName = original.songSections[0].bars[0].blocks[0].chord!.name
    const originalKey = original.mainKey

    const projected = transposeSong(original, 1)

    expect(projected.mainKey).toBe("Cm")
    expect(projected.songSections[0].bars[0].blocks[0].chord?.name).toBe("Cm")
    expect(projected.songSections[0].bars[1].blocks[0].chord?.name).toBe("Gm7")

    expect(original.mainKey).toBe(originalKey)
    expect(original.songSections[0].bars[0].blocks[0].chord?.name).toBe(
      originalName,
    )
    expect(original.songSections[0].bars[1].blocks[0].chord?.name).toBe("F#m7")
  })

  it("leaves rests unchanged", () => {
    const projected = transposeSong(sampleSong(), 1)
    const rest = projected.songSections[0].bars[1].blocks[1]
    expect(rest.type).toBe("rest")
    expect(rest.chord).toBeUndefined()
  })

  it("preserves section label and structure", () => {
    const projected = transposeSong(sampleSong(), 2)
    expect(projected.songSections[0].label).toBe("A")
    expect(projected.songSections[0].type).toBe("VERSE")
    expect(projected.id).toBe("song-1")
    expect(projected.title).toBe("Human Nature")
  })

  it("handles missing mainKey", () => {
    const song = sampleSong()
    delete song.mainKey
    const projected = transposeSong(song, 1)
    expect(projected.mainKey).toBeUndefined()
    expect(projected.songSections[0].bars[0].blocks[0].chord?.name).toBe("Cm")
  })
})
