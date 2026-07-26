import { describe, expect, it } from "vitest"
import {
  collectScrollCues,
  formatCueTime,
  parseCueTimeInput,
  targetScrollYAtTime,
} from "@/modules/songs/utils/scrollSync"

describe("collectScrollCues", () => {
  it("keeps only sections with cueTime, sorted by time", () => {
    expect(
      collectScrollCues([
        { id: "b", cueTime: 90 },
        { id: "a", cueTime: 20 },
        { id: "c" },
      ]),
    ).toEqual([
      { sectionId: "a", t: 20 },
      { sectionId: "b", t: 90 },
    ])
  })
})

describe("targetScrollYAtTime", () => {
  const anchors = [
    { sectionId: "intro", t: 20, scrollY: 100 },
    { sectionId: "chorus", t: 80, scrollY: 400 },
  ]

  it("returns null with no anchors", () => {
    expect(targetScrollYAtTime(10, [])).toBeNull()
  })

  it("eases from 0 to first cue before first.t", () => {
    expect(targetScrollYAtTime(0, anchors)).toBe(0)
    expect(targetScrollYAtTime(10, anchors)).toBe(50)
    expect(targetScrollYAtTime(20, anchors)).toBe(100)
  })

  it("lerps between cues", () => {
    expect(targetScrollYAtTime(50, anchors)).toBe(250)
  })

  it("stops at last cue scrollY after last.t", () => {
    expect(targetScrollYAtTime(80, anchors)).toBe(400)
    expect(targetScrollYAtTime(200, anchors)).toBe(400)
  })

  it("works with a single cue", () => {
    const one = [{ sectionId: "x", t: 60, scrollY: 300 }]
    expect(targetScrollYAtTime(30, one)).toBe(150)
    expect(targetScrollYAtTime(90, one)).toBe(300)
  })
})

describe("cue time parse/format", () => {
  it("parses m:ss and seconds", () => {
    expect(parseCueTimeInput("1:22")).toBe(82)
    expect(parseCueTimeInput("90")).toBe(90)
    expect(parseCueTimeInput("")).toBeUndefined()
    expect(parseCueTimeInput("1:99")).toBeUndefined()
  })

  it("formats m:ss", () => {
    expect(formatCueTime(82)).toBe("1:22")
    expect(formatCueTime(5)).toBe("0:05")
  })
})
