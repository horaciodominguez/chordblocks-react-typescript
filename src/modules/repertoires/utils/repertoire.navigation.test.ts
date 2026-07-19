import { describe, expect, it } from "vitest"
import type { Repertoire } from "../types/repertoire.types"
import {
  flattenRepertoireItems,
  getSetNavContext,
  setSongPath,
} from "./repertoire.navigation"

function makeRep(): Repertoire {
  return {
    id: "rep-1",
    title: "Gig night",
    groups: [
      {
        id: "g1",
        title: "English",
        items: [
          {
            id: "i1",
            songId: "s1",
            transposeSemitones: 0,
          },
          {
            id: "i2",
            songId: "s2",
            transposeSemitones: 1,
          },
        ],
      },
      {
        id: "g2",
        title: "Latinos",
        items: [
          {
            id: "i3",
            songId: "s3",
            transposeSemitones: 0,
          },
        ],
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }
}

describe("repertoire.navigation", () => {
  it("flattens items in group order", () => {
    const flat = flattenRepertoireItems(makeRep())
    expect(flat.map((e) => e.item.id)).toEqual(["i1", "i2", "i3"])
    expect(flat.map((e) => e.index)).toEqual([0, 1, 2])
  })

  it("builds set song paths with query params", () => {
    expect(setSongPath("s2", "rep-1", "i2")).toBe(
      "/song/s2?repertoireId=rep-1&itemId=i2",
    )
  })

  it("resolves prev/next for middle, first, and last items", () => {
    const rep = makeRep()

    const mid = getSetNavContext(rep, "i2")
    expect(mid?.current.index).toBe(1)
    expect(mid?.prev?.item.id).toBe("i1")
    expect(mid?.next?.item.id).toBe("i3")
    expect(mid?.total).toBe(3)

    const first = getSetNavContext(rep, "i1")
    expect(first?.prev).toBeNull()
    expect(first?.next?.item.id).toBe("i2")

    const last = getSetNavContext(rep, "i3")
    expect(last?.prev?.item.id).toBe("i2")
    expect(last?.next).toBeNull()
  })

  it("returns null for unknown itemId", () => {
    expect(getSetNavContext(makeRep(), "missing")).toBeNull()
  })
})
