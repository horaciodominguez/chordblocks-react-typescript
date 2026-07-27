import { describe, expect, it } from "vitest"
import { repackBarsToCapacity } from "@/modules/songs/utils/repackBarsToCapacity"
import type { Bar } from "@/modules/songs/types/bar.types"

function bar(blocks: { id: string; duration: number }[]): Bar {
  return {
    id: "bar-old",
    position: 1,
    blocks: blocks.map((b, i) => ({
      id: b.id,
      type: "chord" as const,
      duration: b.duration,
      position: i + 1,
      chord: { name: "C" },
    })),
  }
}

describe("repackBarsToCapacity", () => {
  it("returns empty for empty input", () => {
    expect(repackBarsToCapacity([], 4)).toEqual([])
  })

  it("clamps overfull block duration to bpm", () => {
    const out = repackBarsToCapacity([bar([{ id: "b1", duration: 8 }])], 4)
    expect(out).toHaveLength(1)
    expect(out[0].blocks[0].duration).toBe(4)
    expect(out[0].blocks[0].id).toBe("b1")
  })

  it("repacks 4/4 bars into 3/4 capacity", () => {
    const input = [
      bar([
        { id: "a", duration: 2 },
        { id: "b", duration: 2 },
      ]),
      bar([{ id: "c", duration: 4 }]),
    ]
    const out = repackBarsToCapacity(input, 3)
    const ids = out.flatMap((b) => b.blocks.map((bl) => bl.id))
    expect(ids).toEqual(["a", "b", "c"])
    for (const b of out) {
      const sum = b.blocks.reduce((s, bl) => s + bl.duration, 0)
      expect(sum).toBeLessThanOrEqual(3)
    }
    // a(2) alone; b(2) alone; c clamped 4→3 alone
    expect(out.map((b) => b.blocks.map((bl) => bl.duration))).toEqual([
      [2],
      [2],
      [3],
    ])
  })

  it("packs a short first bar when pickupBeats is set", () => {
    const input = [
      bar([
        { id: "a", duration: 1 },
        { id: "b", duration: 4 },
      ]),
    ]
    const out = repackBarsToCapacity(input, 4, 1)
    expect(out.map((b) => b.blocks.map((bl) => bl.duration))).toEqual([
      [1],
      [4],
    ])
    expect(out[0].blocks[0].id).toBe("a")
    expect(out[1].blocks[0].id).toBe("b")
  })

  it("clamps an oversized first block into the pickup bar", () => {
    const out = repackBarsToCapacity(
      [bar([{ id: "a", duration: 4 }])],
      4,
      1,
    )
    expect(out).toHaveLength(1)
    expect(out[0].blocks[0].duration).toBe(1)
  })
})
