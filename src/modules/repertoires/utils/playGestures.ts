/**
 * Pure gesture classification for Play atril (S2.7).
 * Swipe = set prev/next. Double-tap (touch) = next section.
 * Must not fight vertical scroll or steal mouse clicks.
 */

export const SWIPE_MIN_DISTANCE_PX = 72
/** Vertical travel may not exceed this share of horizontal travel. */
export const SWIPE_MAX_VERTICAL_RATIO = 0.55
export const TAP_MAX_MOVE_PX = 12
export const TAP_MAX_DURATION_MS = 400
/** Scroll wins if finger moves this far vertically before a swipe. */
export const SCROLL_CANCEL_DY_PX = 28
export const DOUBLE_TAP_MS = 320
export const DOUBLE_TAP_SLOP_PX = 28

export type PointerSample = {
  x: number
  y: number
  t: number
}

export type ClassifiedGesture =
  | { kind: "swipe"; direction: "left" | "right" }
  | { kind: "tap" }
  | { kind: "none" }

export function classifyPointerGesture(
  start: PointerSample,
  end: PointerSample,
): ClassifiedGesture {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  const dt = end.t - start.t

  if (
    absDx >= SWIPE_MIN_DISTANCE_PX &&
    absDx > absDy &&
    absDy <= absDx * SWIPE_MAX_VERTICAL_RATIO
  ) {
    return { kind: "swipe", direction: dx < 0 ? "left" : "right" }
  }

  if (
    absDx <= TAP_MAX_MOVE_PX &&
    absDy <= TAP_MAX_MOVE_PX &&
    dt <= TAP_MAX_DURATION_MS
  ) {
    return { kind: "tap" }
  }

  return { kind: "none" }
}

/** True when vertical movement should cancel a pending gesture (user is scrolling). */
export function shouldCancelGestureForScroll(dx: number, dy: number): boolean {
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  return absDy >= SCROLL_CANCEL_DY_PX && absDy > absDx
}

export function isDoubleTap(
  previous: PointerSample | null,
  current: PointerSample,
): boolean {
  if (!previous) return false
  const dt = current.t - previous.t
  if (dt <= 0 || dt > DOUBLE_TAP_MS) return false
  const dx = Math.abs(current.x - previous.x)
  const dy = Math.abs(current.y - previous.y)
  return dx <= DOUBLE_TAP_SLOP_PX && dy <= DOUBLE_TAP_SLOP_PX
}

/** True when the event target (or an ancestor) should not trigger Play gestures. */
export function isPlayGestureIgnoredTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as Element).closest !== "function") return true
  return Boolean(
    (target as Element).closest(
      'a, button, input, textarea, select, label, [role="button"], [role="link"], [data-no-play-gesture]',
    ),
  )
}

/**
 * Next chart section below the sticky chrome line.
 * `topInset` ≈ sticky Play chrome height (viewport coords).
 */
export function findNextPlaySection(
  root: ParentNode,
  topInset: number,
): HTMLElement | null {
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>("[data-play-section]"),
  )
  if (nodes.length === 0) return null

  let currentIdx = -1
  for (let i = 0; i < nodes.length; i++) {
    const top = nodes[i].getBoundingClientRect().top
    if (top <= topInset + 12) currentIdx = i
    else break
  }

  const nextIdx = currentIdx + 1
  if (nextIdx >= nodes.length) return null
  return nodes[nextIdx]
}

export function scrollPlaySectionIntoView(el: HTMLElement): void {
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}
