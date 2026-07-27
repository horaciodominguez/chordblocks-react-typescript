import { describe, expect, it } from "vitest"
import { padBarsWithRests } from "@/modules/songs/utils/padBarsWithRests"
import type { Bar } from "@/modules/songs/types/bar.types"

function bar(
  blocks: { id: string; duration: number; type?: "chord" | "rest" }[],
): Bar {
  return {
    id: "bar-1",
    position: 1,
    blocks: blocks.map((b, i) =>
      b.type === "rest"
        ? {
            id: b.id,
            type: "rest" as const,
            duration: b.duration,
            position: i + 1,
          }
        : {
            id: b.id,
            type: "chord" as const,
            duration: b.duration,
            position: i + 1,
            chord: { name: "C" },
          },
    ),
  }
}

describe("padBarsWithRests", () => {
  it("pads a short last block to fill 4/4", () => {
    const out = padBarsWithRests(
      [bar([{ id: "c1", duration: 1 }])],
      4,
    )
    expect(out[0].blocks).toHaveLength(2)
    expect(out[0].blocks[0].duration).toBe(1)
    expect(out[0].blocks[1].type).toBe("rest")
    expect(out[0].blocks[1].duration).toBe(3)
    expect(out[0].blocks[1].position).toBe(2)
  })

  it("pads when a block was shrunk leaving a hole", () => {
    const out = padBarsWithRests(
      [
        bar([
          { id: "a", duration: 2 },
          { id: "b", duration: 1 },
        ]),
      ],
      4,
    )
    expect(out[0].blocks).toHaveLength(3)
    expect(out[0].blocks[2].type).toBe("rest")
    expect(out[0].blocks[2].duration).toBe(1)
  })

  it("extends a trailing rest instead of adding another", () => {
    const out = padBarsWithRests(
      [
        bar([
          { id: "a", duration: 2 },
          { id: "r", duration: 1, type: "rest" },
        ]),
      ],
      4,
    )
    expect(out[0].blocks).toHaveLength(2)
    expect(out[0].blocks[1].type).toBe("rest")
    expect(out[0].blocks[1].id).toBe("r")
    expect(out[0].blocks[1].duration).toBe(2)
  })

  it("leaves a full bar unchanged", () => {
    const input = [
      bar([
        { id: "a", duration: 2 },
        { id: "b", duration: 2 },
      ]),
    ]
    const out = padBarsWithRests(input, 4)
    expect(out[0].blocks).toHaveLength(2)
    expect(out[0].blocks.map((b) => b.duration)).toEqual([2, 2])
  })

  it("respects pickup capacity on the first bar", () => {
    const out = padBarsWithRests(
      [bar([{ id: "c1", duration: 1 }]), bar([{ id: "c2", duration: 2 }])],
      4,
      1,
    )
    // Pickup bar capacity 1 → already full
    expect(out[0].blocks).toHaveLength(1)
    expect(out[0].blocks[0].duration).toBe(1)
    // Second bar 4/4 with 2 → pad 2
    expect(out[1].blocks).toHaveLength(2)
    expect(out[1].blocks[1].type).toBe("rest")
    expect(out[1].blocks[1].duration).toBe(2)
  })

  it("fills an empty bar with a full-measure rest", () => {
    const empty: Bar = { id: "empty", position: 1, blocks: [] }
    const out = padBarsWithRests([empty], 4)
    expect(out[0].blocks).toHaveLength(1)
    expect(out[0].blocks[0].type).toBe("rest")
    expect(out[0].blocks[0].duration).toBe(4)
  })
})
