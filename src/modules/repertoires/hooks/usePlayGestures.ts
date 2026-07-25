import { useCallback, useRef, type RefObject } from "react"
import {
  classifyPointerGesture,
  findNextPlaySection,
  isDoubleTap,
  isPlayGestureIgnoredTarget,
  scrollPlaySectionIntoView,
  shouldCancelGestureForScroll,
  type PointerSample,
} from "@/modules/repertoires/utils/playGestures"

type Options = {
  enabled: boolean
  /** Swipe left → next set item */
  onSwipeNext?: () => void
  /** Swipe right → previous set item */
  onSwipePrev?: () => void
  /** Sticky chrome element — inset for section scroll. */
  chromeInsetRef?: RefObject<HTMLElement | null>
}

type GestureState = {
  pointerId: number
  pointerType: string
  start: PointerSample
  cancelled: boolean
}

/**
 * Play chart gestures (S2.7):
 * - horizontal swipe (touch/pen) → prev/next set song
 * - double-tap (touch/pen) → next section
 * - mouse clicks never advance sections (avoids breaking desktop)
 * - vertical scroll cancels the gesture
 */
export function usePlayGestures({
  enabled,
  onSwipeNext,
  onSwipePrev,
  chromeInsetRef,
}: Options) {
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const gestureRef = useRef<GestureState | null>(null)
  const lastTapRef = useRef<PointerSample | null>(null)

  const resolveTopInset = useCallback(() => {
    const chrome = chromeInsetRef?.current
    if (chrome) {
      return Math.max(0, chrome.getBoundingClientRect().bottom)
    }
    return 104
  }, [chromeInsetRef])

  const advanceSection = useCallback(() => {
    const root = surfaceRef.current
    if (!root) return
    const next = findNextPlaySection(root, resolveTopInset())
    if (next) scrollPlaySectionIntoView(next)
  }, [resolveTopInset])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return
      if (event.pointerType === "mouse" && event.button !== 0) return
      if (isPlayGestureIgnoredTarget(event.target)) {
        gestureRef.current = null
        return
      }
      gestureRef.current = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        cancelled: false,
        start: {
          x: event.clientX,
          y: event.clientY,
          t: event.timeStamp,
        },
      }
    },
    [enabled],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current
      if (!enabled || !gesture || gesture.cancelled) return
      if (gesture.pointerId !== event.pointerId) return
      const dx = event.clientX - gesture.start.x
      const dy = event.clientY - gesture.start.y
      if (shouldCancelGestureForScroll(dx, dy)) {
        gesture.cancelled = true
      }
    },
    [enabled],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current
      gestureRef.current = null
      if (!enabled || !gesture || gesture.cancelled) return
      if (gesture.pointerId !== event.pointerId) return
      if (isPlayGestureIgnoredTarget(event.target)) return

      const end: PointerSample = {
        x: event.clientX,
        y: event.clientY,
        t: event.timeStamp,
      }
      const result = classifyPointerGesture(gesture.start, end)
      const isTouchLike =
        gesture.pointerType === "touch" || gesture.pointerType === "pen"

      if (result.kind === "swipe") {
        // Swipe works for touch/pen; mouse optional for desktop testing.
        if (result.direction === "left") onSwipeNext?.()
        else onSwipePrev?.()
        lastTapRef.current = null
        return
      }

      if (result.kind === "tap" && isTouchLike) {
        if (isDoubleTap(lastTapRef.current, end)) {
          lastTapRef.current = null
          advanceSection()
        } else {
          lastTapRef.current = end
        }
        return
      }

      lastTapRef.current = null
    },
    [enabled, onSwipeNext, onSwipePrev, advanceSection],
  )

  const onPointerCancel = useCallback(() => {
    gestureRef.current = null
  }, [])

  return {
    surfaceRef,
    gestureProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      style: enabled ? ({ touchAction: "pan-y" } as const) : undefined,
    },
  }
}
