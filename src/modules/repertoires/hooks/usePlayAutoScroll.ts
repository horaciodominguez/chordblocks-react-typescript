import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { RefObject } from "react"
import type { AutoScrollSpeed } from "@/modules/songs/types/autoScroll.types"
import type { SongSection } from "@/modules/songs/types/section.types"
import {
  collectScrollCues,
  formatCueTime,
  syncClockRate,
  targetScrollYAtTime,
  type ScrollAnchor,
} from "@/modules/songs/utils/scrollSync"

export type AutoScrollRunState = "idle" | "playing" | "paused"

type Options = {
  playMode: boolean
  speed: AutoScrollSpeed
  sections: Pick<SongSection, "id" | "cueTime">[]
  chromeInsetRef?: RefObject<HTMLElement | null>
  chartRootRef?: RefObject<HTMLElement | null>
}

const WHEEL_RESUME_MS = 900

function isPauseExemptTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest(
      "[data-no-autoscroll-pause], [data-no-play-gesture], [data-set-song-nav]",
    ),
  )
}

function measureAnchors(
  cues: ReturnType<typeof collectScrollCues>,
  chartRoot: HTMLElement | null,
  chromeBottom: number,
): ScrollAnchor[] {
  if (!chartRoot || cues.length === 0) return []
  const anchors: ScrollAnchor[] = []
  for (const cue of cues) {
    const el = chartRoot.querySelector<HTMLElement>(
      `[data-play-section][data-section-id="${CSS.escape(cue.sectionId)}"]`,
    )
    if (!el) continue
    const scrollY = Math.max(
      0,
      window.scrollY + el.getBoundingClientRect().top - chromeBottom,
    )
    anchors.push({ ...cue, scrollY })
  }
  return anchors
}

/**
 * Play auto-scroll driven by section `cueTime` anchors.
 * Interpolates between cues; stops at the last marked section.
 */
export function usePlayAutoScroll({
  playMode,
  speed,
  sections,
  chromeInsetRef,
  chartRootRef,
}: Options) {
  const [runState, setRunState] = useState<AutoScrollRunState>("idle")
  const [elapsedSec, setElapsedSec] = useState(0)

  const holdPauseRef = useRef(false)
  const wheelPauseRef = useRef(false)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const elapsedRef = useRef(0)
  const speedRef = useRef(speed)
  speedRef.current = speed

  const cues = useMemo(() => collectScrollCues(sections), [sections])
  const hasCues = cues.length > 0
  const lastCueSec = hasCues ? cues[cues.length - 1].t : 0
  const cuesKey = cues.map((c) => `${c.sectionId}:${c.t}`).join("|")

  const resolveChromeBottom = useCallback(() => {
    const chrome = chromeInsetRef?.current
    if (chrome) return Math.max(0, chrome.getBoundingClientRect().bottom)
    return 104
  }, [chromeInsetRef])

  const start = useCallback(() => {
    if (!playMode || !hasCues) return
    holdPauseRef.current = false
    wheelPauseRef.current = false
    elapsedRef.current = 0
    setElapsedSec(0)
    setRunState("playing")
  }, [playMode, hasCues])

  const pause = useCallback(() => {
    setRunState((s) => (s === "playing" ? "paused" : s))
  }, [])

  const stop = useCallback(() => {
    holdPauseRef.current = false
    wheelPauseRef.current = false
    elapsedRef.current = 0
    setElapsedSec(0)
    setRunState("idle")
  }, [])

  const toggle = useCallback(() => {
    if (!playMode || !hasCues) return
    setRunState((s) => {
      if (s === "playing") return "paused"
      if (s === "idle") {
        elapsedRef.current = 0
        setElapsedSec(0)
      }
      holdPauseRef.current = false
      wheelPauseRef.current = false
      return "playing"
    })
  }, [playMode, hasCues])

  useEffect(() => {
    if (!playMode) {
      holdPauseRef.current = false
      wheelPauseRef.current = false
      elapsedRef.current = 0
      setElapsedSec(0)
      setRunState("idle")
    }
  }, [playMode])

  // Sync clock + scroll chase
  useEffect(() => {
    if (!playMode || runState !== "playing" || !hasCues) return

    let raf = 0
    let last = performance.now()
    let uiAccum = 0

    const tick = (now: number) => {
      const dt = Math.min(0.064, Math.max(0, (now - last) / 1000))
      last = now

      if (!holdPauseRef.current && !wheelPauseRef.current) {
        elapsedRef.current += dt * syncClockRate(speedRef.current)
        uiAccum += dt
        if (uiAccum >= 0.2) {
          uiAccum = 0
          setElapsedSec(elapsedRef.current)
        }

        const anchors = measureAnchors(
          cues,
          chartRootRef?.current ?? null,
          resolveChromeBottom(),
        )
        const target = targetScrollYAtTime(elapsedRef.current, anchors)
        if (target !== null) {
          const cur = window.scrollY
          const next = cur + (target - cur) * 0.35
          if (Math.abs(target - cur) < 1) {
            window.scrollTo(0, target)
          } else {
            window.scrollTo(0, next)
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playMode, runState, hasCues, cuesKey, chartRootRef, resolveChromeBottom])

  // Soft pause on chart interact
  useEffect(() => {
    if (!playMode || runState !== "playing") return

    const onPointerDown = (event: PointerEvent) => {
      if (isPauseExemptTarget(event.target)) return
      holdPauseRef.current = true
    }
    const onPointerUp = () => {
      holdPauseRef.current = false
    }
    const onWheel = (event: WheelEvent) => {
      if (isPauseExemptTarget(event.target)) return
      wheelPauseRef.current = true
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => {
        wheelPauseRef.current = false
        wheelTimerRef.current = null
      }, WHEEL_RESUME_MS)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRunState("paused")
    }

    const opts: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener("pointerdown", onPointerDown, opts)
    window.addEventListener("pointerup", onPointerUp, opts)
    window.addEventListener("pointercancel", onPointerUp, opts)
    window.addEventListener("wheel", onWheel, opts)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, opts)
      window.removeEventListener("pointerup", onPointerUp, opts)
      window.removeEventListener("pointercancel", onPointerUp, opts)
      window.removeEventListener("wheel", onWheel, opts)
      window.removeEventListener("keydown", onKeyDown)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      holdPauseRef.current = false
      wheelPauseRef.current = false
    }
  }, [playMode, runState])

  return {
    runState,
    toggle,
    start,
    pause,
    stop,
    hasCues,
    cueCount: cues.length,
    elapsedLabel: formatCueTime(elapsedSec),
    lastCueLabel: hasCues ? formatCueTime(lastCueSec) : null,
    pastLastCue: hasCues && elapsedSec >= lastCueSec,
  }
}
