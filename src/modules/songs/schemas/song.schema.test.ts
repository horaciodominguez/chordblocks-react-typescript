import { describe, expect, it } from "vitest"
import { SongSchema } from "@/modules/songs/schemas/song.schema"

describe("SongSchema riff/solo blocks", () => {
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

  it("accepts riff and solo blocks", () => {
    const result = SongSchema.safeParse({
      ...baseSong,
      songSections: [
        {
          id: "sec-1",
          type: "OTHER",
          label: "Riff 1",
          repeats: 1,
          bars: [
            {
              id: "bar-1",
              position: 1,
              blocks: [
                {
                  id: "b1",
                  type: "riff",
                  label: "Riff 1",
                  duration: 4,
                  position: 1,
                },
              ],
            },
          ],
        },
        {
          id: "sec-2",
          type: "SOLO",
          repeats: 1,
          bars: [
            {
              id: "bar-2",
              position: 1,
              blocks: [
                {
                  id: "b2",
                  type: "solo",
                  duration: 4,
                  position: 1,
                },
              ],
            },
          ],
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it("accepts riff without label", () => {
    const result = SongSchema.safeParse({
      ...baseSong,
      songSections: [
        {
          id: "sec-1",
          type: "OTHER",
          repeats: 1,
          bars: [
            {
              id: "bar-1",
              position: 1,
              blocks: [
                {
                  id: "b1",
                  type: "riff",
                  duration: 4,
                  position: 1,
                },
              ],
            },
          ],
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it("accepts optional lyric on chord/rest and strips blank", () => {
    const withLyric = SongSchema.safeParse({
      ...baseSong,
      songSections: [
        {
          id: "sec-1",
          type: "VERSE",
          repeats: 1,
          bars: [
            {
              id: "bar-1",
              position: 1,
              blocks: [
                {
                  id: "b1",
                  type: "chord",
                  duration: 2,
                  position: 1,
                  chord: { name: "C" },
                  lyric: "  Hello  ",
                },
                {
                  id: "b2",
                  type: "rest",
                  duration: 2,
                  position: 2,
                  lyric: "",
                },
              ],
            },
          ],
        },
      ],
    })
    expect(withLyric.success).toBe(true)
    if (withLyric.success) {
      expect(withLyric.data.songSections[0].bars[0].blocks[0].lyric).toBe(
        "Hello",
      )
      expect(withLyric.data.songSections[0].bars[0].blocks[1].lyric).toBeUndefined()
    }
  })
})
