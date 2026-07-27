import { describe, expect, it } from "vitest"
import { restGlyphsForDuration } from "@/modules/chords/utils/restSymbols"

describe("restGlyphsForDuration", () => {
  it("uses whole rest for a full 4/4 measure", () => {
    expect(restGlyphsForDuration(4, 4, 4)).toEqual([
      expect.objectContaining({ kind: "whole", dotted: false }),
    ])
  })

  it("maps 3 beats in 4/4 to a dotted half rest", () => {
    expect(restGlyphsForDuration(3, 4, 4)).toEqual([
      expect.objectContaining({ kind: "half", dotted: true, beats: 3 }),
    ])
  })

  it("maps 2 beats to a half rest", () => {
    expect(restGlyphsForDuration(2, 4, 4)).toEqual([
      expect.objectContaining({ kind: "half", dotted: false, beats: 2 }),
    ])
  })

  it("maps 1 beat to a quarter rest", () => {
    expect(restGlyphsForDuration(1, 4, 4)).toEqual([
      expect.objectContaining({ kind: "quarter", dotted: false, beats: 1 }),
    ])
  })

  it("decomposes 5 beats as whole + quarter", () => {
    const glyphs = restGlyphsForDuration(5, 8, 4)
    expect(glyphs.map((g) => [g.kind, g.dotted, g.beats])).toEqual([
      ["whole", false, 4],
      ["quarter", false, 1],
    ])
  })

  it("maps 3 beats in 6/8 (noteValue 8) to dotted quarter", () => {
    expect(restGlyphsForDuration(3, 6, 8)).toEqual([
      expect.objectContaining({ kind: "quarter", dotted: true, beats: 3 }),
    ])
  })

  it("maps 1 beat in 6/8 to eighth rest", () => {
    expect(restGlyphsForDuration(1, 6, 8)).toEqual([
      expect.objectContaining({ kind: "eighth", dotted: false, beats: 1 }),
    ])
  })
})
