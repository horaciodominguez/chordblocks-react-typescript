import { describe, expect, it } from "vitest"
import {
  effectiveTimeSignature,
  formatTimeSignature,
} from "@/modules/songs/utils/effectiveTimeSignature"

describe("effectiveTimeSignature", () => {
  const song = { beatsPerMeasure: 4, noteValue: 4 }

  it("falls back to song when section has no override", () => {
    expect(effectiveTimeSignature(song)).toEqual(song)
    expect(effectiveTimeSignature(song, undefined)).toEqual(song)
  })

  it("uses section override when present", () => {
    const section = { beatsPerMeasure: 3, noteValue: 4 }
    expect(effectiveTimeSignature(song, section)).toEqual(section)
  })

  it("formats meter for display", () => {
    expect(formatTimeSignature(song)).toBe("4/4")
  })
})
