import { describe, expect, it } from "vitest"
import {
  expectedSlashFlatAliasIds,
  expectedSpriteChordIds,
  hasCuratedSlashFingering,
  SLASH_SPRITE_IDS,
  slashVariationsForPitch,
  SPRITE_SUFFIXES,
} from "@/modules/chords/data/chordFingerings"
import { VARIATIONS } from "@/modules/chords/data/chords"

describe("slash fingering catalog", () => {
  it("exposes only hand-curated slash ids", () => {
    expect(SLASH_SPRITE_IDS).toContain("F_C")
    expect(SLASH_SPRITE_IDS).toContain("C_E")
    expect(SLASH_SPRITE_IDS).not.toContain("Cm_A#")
  })

  it("lists slash as variations for matching pitch only", () => {
    const forC = slashVariationsForPitch("C").map((v) => v.name)
    expect(forC).toEqual(expect.arrayContaining(["C/E", "C/G", "C7/E"]))
    expect(forC).not.toContain("F/C")

    const forA = slashVariationsForPitch("A").map((v) => v.name)
    expect(forA).toEqual(
      expect.arrayContaining(["A/C#", "A/E", "Am/C", "Am/E", "Am/G"]),
    )
  })

  it("detects curated slash without inventing others", () => {
    expect(hasCuratedSlashFingering("F/C")).toBe(true)
    expect(hasCuratedSlashFingering("Cm/A#")).toBe(false)
    expect(hasCuratedSlashFingering("F")).toBe(false)
  })

  it("keeps quality VARIATIONS and sprite suffixes aligned", () => {
    expect(VARIATIONS).toHaveLength(19)
    expect(SPRITE_SUFFIXES).toHaveLength(19)
  })

  it("expected ids include slash and flat slash aliases", () => {
    const expected = expectedSpriteChordIds()
    const base = 19 * 12 + 19 * 5
    expect(expected).toHaveLength(
      base + SLASH_SPRITE_IDS.length + expectedSlashFlatAliasIds().length,
    )
    expect(expected).toContain("F_C")
    expect(expected).toContain("D_Gb")
  })
})
