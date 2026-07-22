import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import {
  expectedSpriteChordIds,
  SPRITE_SUFFIXES,
} from "@/modules/chords/data/chordFingerings"
import { VARIATIONS } from "@/modules/chords/data/chords"

const spritePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../public/assets/chords-sprite.svg",
)

function spriteIds(svg: string): Set<string> {
  const ids = new Set<string>()
  for (const m of svg.matchAll(/\bid="([^"]+)"/g)) {
    ids.add(m[1])
  }
  return ids
}

describe("chords sprite catalog", () => {
  const svg = readFileSync(spritePath, "utf8")
  const ids = spriteIds(svg)

  it("has 19 variations matching sprite suffixes", () => {
    expect(VARIATIONS).toHaveLength(19)
    expect(SPRITE_SUFFIXES).toHaveLength(19)
    const fromPicker = VARIATIONS.map((v) => v.suffix).sort()
    const fromSprite = [...SPRITE_SUFFIXES].sort()
    expect(fromPicker).toEqual(fromSprite)
  })

  it("contains every expected chord and flat alias id", () => {
    const expected = expectedSpriteChordIds()
    expect(expected).toHaveLength(19 * 12 + 19 * 5)
    for (const id of expected) {
      expect(ids.has(id), `missing symbol #${id}`).toBe(true)
    }
  })

  it("has no HTML comments", () => {
    expect(svg.includes("<!--")).toBe(false)
  })

  it("aliases Dbmaj7 to C#maj7", () => {
    expect(svg).toMatch(/id="Dbmaj7"><use href="#C#maj7"/)
  })
})
