import { describe, it, expect } from "vitest"
import {
  allowedBlockDurations,
  barCapacity,
  normalizePickupBeats,
} from "./beats"
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

describe("normalizePickupBeats", () => {
  it("accepts 1 … bpm-1", () => {
    expect(normalizePickupBeats(1, 4)).toBe(1)
    expect(normalizePickupBeats(3, 4)).toBe(3)
  })

  it("rejects full measure, zero, and invalid", () => {
    expect(normalizePickupBeats(4, 4)).toBeUndefined()
    expect(normalizePickupBeats(0, 4)).toBeUndefined()
    expect(normalizePickupBeats(undefined, 4)).toBeUndefined()
    expect(normalizePickupBeats(1.7, 4)).toBe(1)
  })
})

describe("barCapacity", () => {
  it("uses pickup only on first bar", () => {
    expect(barCapacity(4, 0, 1)).toBe(1)
    expect(barCapacity(4, 1, 1)).toBe(4)
    expect(barCapacity(4, 0)).toBe(4)
  })
})
