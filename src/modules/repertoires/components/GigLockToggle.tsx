import { useEffect, useRef, useState } from "react"
import { Lock, Unlock } from "lucide-react"
import { toast } from "sonner"
import { useGigLock } from "@/modules/repertoires/context/GigLockContext"

/** Hold this long to unlock — short taps must not disable gig lock. */
export const GIG_UNLOCK_HOLD_MS = 1500

type Props = {
  compact?: boolean
}

/**
 * Gig read-only lock control (S2.8).
 * - Unlocked → tap to lock immediately
 * - Locked → press & hold ~1.5s to unlock (progress ring)
 * Short taps while locked only nudge the button — no toast over the control.
 */
export function GigLockToggle({ compact = false }: Props) {
  const { locked, lock, unlock } = useGigLock()
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [nudge, setNudge] = useState(false)
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const nudgeTimerRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const unlockedByHoldRef = useRef(false)

  const clearHold = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setHolding(false)
    setProgress(0)
  }

  useEffect(
    () => () => {
      clearHold()
      if (nudgeTimerRef.current != null) {
        window.clearTimeout(nudgeTimerRef.current)
      }
    },
    [],
  )

  const tick = () => {
    const elapsed = performance.now() - startRef.current
    const p = Math.min(1, elapsed / GIG_UNLOCK_HOLD_MS)
    setProgress(p)
    if (p < 1) {
      rafRef.current = window.requestAnimationFrame(tick)
    }
  }

  const flashNudge = () => {
    setNudge(true)
    if (nudgeTimerRef.current != null) {
      window.clearTimeout(nudgeTimerRef.current)
    }
    nudgeTimerRef.current = window.setTimeout(() => setNudge(false), 450)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)

    if (!locked) {
      lock()
      toast.message("Gig lock on", { duration: 1400 })
      return
    }

    unlockedByHoldRef.current = false
    startRef.current = performance.now()
    setHolding(true)
    setProgress(0)
    rafRef.current = window.requestAnimationFrame(tick)
    timerRef.current = window.setTimeout(() => {
      unlockedByHoldRef.current = true
      unlock()
      clearHold()
      toast.message("Gig lock off", { duration: 1400 })
    }, GIG_UNLOCK_HOLD_MS)
  }

  const onPointerUp = () => {
    if (!locked && !holding) return
    const wasHolding = holding
    const completed = unlockedByHoldRef.current
    clearHold()
    // Short tap while locked: brief button pulse only (no toast covering the control).
    if (wasHolding && !completed) {
      flashNudge()
    }
  }

  const size = compact ? 14 : 16
  const box = compact
    ? "relative inline-flex items-center justify-center min-h-9 min-w-9 rounded-md"
    : "relative inline-flex items-center justify-center gap-1.5 min-h-9 px-2.5 rounded-md text-xs font-semibold"

  return (
    <button
      type="button"
      aria-pressed={locked}
      aria-label={
        locked
          ? "Gig lock on — press and hold to unlock"
          : "Enable gig lock (read-only)"
      }
      title={
        locked
          ? "Gig lock on — hold 1.5s to unlock"
          : "Gig lock — prevent accidental edits"
      }
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={clearHold}
      onContextMenu={(e) => e.preventDefault()}
      className={`${box} border select-none touch-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        nudge ? "animate-pulse ring-2 ring-amber-400/80" : ""
      } ${
        locked
          ? "border-amber-500/60 bg-amber-400/15 text-amber-200 light:border-amber-400 light:bg-amber-50 light:text-amber-800 stage:border-white stage:bg-white stage:text-black"
          : "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 light:border-zinc-300 light:text-zinc-600 light:hover:text-zinc-900 stage:border-zinc-600 stage:text-zinc-300"
      }`}
    >
      {holding ? (
        <svg
          className="absolute inset-0 m-auto"
          width={compact ? 28 : 32}
          height={compact ? 28 : 32}
          viewBox="0 0 32 32"
          aria-hidden
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2.5"
          />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 13}
            strokeDashoffset={2 * Math.PI * 13 * (1 - progress)}
            transform="rotate(-90 16 16)"
          />
        </svg>
      ) : null}
      {locked ? <Lock size={size} aria-hidden /> : <Unlock size={size} aria-hidden />}
      {!compact ? <span>{locked ? "Locked" : "Lock"}</span> : null}
    </button>
  )
}
