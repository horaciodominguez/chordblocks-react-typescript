import { describe, it, expect } from "vitest"
import { allowedBlockDurations } from "./beats"
import type { Bar } from "../types/bar.types"

describe("allowedBlockDurations", () => {
  const bar: Bar = {
    id: "bar-1",
    position: 1,
    blocks: [
      {
        id: "b1",
        type: "chord",
        duration: 2,
        position: 1,
        chord: { name: "C" },
      },
      {
        id: "b2",
        type: "chord",
        duration: 1,
        position: 2,
        chord: { name: "G" },
      },
    ],
  }

  it("allows up to remaining space plus current block duration", () => {
    expect(allowedBlockDurations(bar, "b1", 4)).toEqual([1, 2, 3])
    expect(allowedBlockDurations(bar, "b2", 4)).toEqual([1, 2])
  })
})
