import { describe, expect, it } from "vitest"
import {
  classifyPointerGesture,
  isDoubleTap,
  shouldCancelGestureForScroll,
  SWIPE_MIN_DISTANCE_PX,
  TAP_MAX_MOVE_PX,
} from "./playGestures"

describe("classifyPointerGesture", () => {
  const t0 = 1_000

  it("detects left swipe (next)", () => {
    expect(
      classifyPointerGesture(
        { x: 200, y: 100, t: t0 },
        { x: 200 - SWIPE_MIN_DISTANCE_PX, y: 105, t: t0 + 120 },
      ),
    ).toEqual({ kind: "swipe", direction: "left" })
  })

  it("detects right swipe (prev)", () => {
    expect(
      classifyPointerGesture(
        { x: 80, y: 100, t: t0 },
        { x: 80 + SWIPE_MIN_DISTANCE_PX + 10, y: 108, t: t0 + 100 },
      ),
    ).toEqual({ kind: "swipe", direction: "right" })
  })

  it("ignores diagonal-dominant vertical scroll", () => {
    expect(
      classifyPointerGesture(
        { x: 100, y: 50, t: t0 },
        { x: 130, y: 200, t: t0 + 200 },
      ),
    ).toEqual({ kind: "none" })
  })

  it("detects tap with little movement", () => {
    expect(
      classifyPointerGesture(
        { x: 100, y: 100, t: t0 },
        { x: 100 + TAP_MAX_MOVE_PX - 2, y: 102, t: t0 + 80 },
      ),
    ).toEqual({ kind: "tap" })
  })

  it("rejects long slow moves as none", () => {
    expect(
      classifyPointerGesture(
        { x: 100, y: 100, t: t0 },
        { x: 120, y: 120, t: t0 + 800 },
      ),
    ).toEqual({ kind: "none" })
  })
})

describe("shouldCancelGestureForScroll", () => {
  it("cancels when vertical dominates", () => {
    expect(shouldCancelGestureForScroll(10, 40)).toBe(true)
    expect(shouldCancelGestureForScroll(80, 10)).toBe(false)
  })
})

describe("isDoubleTap", () => {
  it("detects a second tap in window", () => {
    const first = { x: 100, y: 100, t: 1000 }
    const second = { x: 105, y: 102, t: 1250 }
    expect(isDoubleTap(first, second)).toBe(true)
  })

  it("rejects taps that are too far apart in time", () => {
    const first = { x: 100, y: 100, t: 1000 }
    const second = { x: 100, y: 100, t: 1600 }
    expect(isDoubleTap(first, second)).toBe(false)
  })
})
