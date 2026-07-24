import { describe, expect, it, vi } from "vitest"
import { songsData } from "@/modules/songs/data/songs"
import {
  parseStoredSong,
  parseStoredSongs,
} from "@/modules/songs/validation/parseStoredSong"

describe("parseStoredSong", () => {
  it("accepts catalog seed songs", () => {
    const parsed = parseStoredSongs(songsData, "test.seed")
    expect(parsed).toHaveLength(songsData.length)
  })

  it("returns null for corrupt documents without throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    expect(parseStoredSong({ id: "bad", title: "Nope" }, "test")).toBeNull()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it("coerces missing image fields to null", () => {
    const sample = structuredClone(songsData[0]) as unknown as Record<
      string,
      unknown
    >
    delete sample.imageUrl
    delete sample.imageBase64
    const song = parseStoredSong(sample, "test")
    expect(song).not.toBeNull()
    expect(song?.imageUrl).toBeNull()
    expect(song?.imageBase64).toBeNull()
  })

  it("filters invalid rows from a list", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const out = parseStoredSongs([songsData[0], { id: "x" }, songsData[1]])
    expect(out).toHaveLength(2)
    warn.mockRestore()
  })
})
