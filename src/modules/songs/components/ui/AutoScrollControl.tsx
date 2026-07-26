import {
  AUTO_SCROLL_SPEED_LABELS,
  AUTO_SCROLL_SPEEDS,
  type AutoScrollSpeed,
} from "@/modules/songs/types/autoScroll.types"
import type { AutoScrollRunState } from "@/modules/repertoires/hooks/usePlayAutoScroll"
import { Pause, Play } from "lucide-react"

type Props = {
  runState: AutoScrollRunState
  speed: AutoScrollSpeed
  hasCues: boolean
  cueCount: number
  elapsedLabel: string
  lastCueLabel: string | null
  pastLastCue: boolean
  onToggleRun: () => void
  onSpeedChange: (speed: AutoScrollSpeed) => void
  compact?: boolean
}

/**
 * Play toolbar: section-cue auto-scroll (Go tracks sync clock).
 */
export function AutoScrollControl({
  runState,
  speed,
  hasCues,
  cueCount,
  elapsedLabel,
  lastCueLabel,
  pastLastCue,
  onToggleRun,
  onSpeedChange,
  compact = false,
}: Props) {
  const running = runState === "playing"
  const paused = runState === "paused"
  const disabled = !hasCues

  return (
    <div
      data-no-autoscroll-pause=""
      className="inline-flex flex-wrap items-center gap-2"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 light:text-zinc-500 stage:text-zinc-400">
        Sync
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={running}
        aria-label={
          disabled
            ? "Add sync times on sections to enable auto-scroll"
            : running
              ? "Pause sync scroll"
              : "Start sync scroll"
        }
        title={
          disabled
            ? "Edit the song and set Sync time on one or more sections"
            : paused
              ? "Resume sync scroll"
              : running
                ? "Pause (hold chart to pause briefly)"
                : "Start sync scroll from 0:00"
        }
        onClick={onToggleRun}
        className={`inline-flex items-center justify-center gap-1 rounded-md font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed ${
          compact
            ? "min-h-8 min-w-8 px-2 text-[10px]"
            : "min-h-9 px-2.5 text-[10px]"
        } ${
          running
            ? "bg-indigo-600/35 text-indigo-100 border border-indigo-500/40 light:bg-indigo-100 light:text-indigo-800 light:border-indigo-200 stage:bg-white stage:text-black stage:border-white"
            : paused
              ? "border border-amber-500/50 text-amber-200 light:border-amber-400 light:text-amber-800 stage:border-zinc-500 stage:text-white"
              : "border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 light:border-zinc-300 light:text-zinc-600 light:hover:text-zinc-900 stage:border-zinc-600 stage:text-zinc-400"
        }`}
      >
        {running ? (
          <Pause size={12} aria-hidden />
        ) : (
          <Play size={12} aria-hidden />
        )}
        <span className="hidden sm:inline">
          {paused ? "Resume" : running ? "Pause" : "Go"}
        </span>
      </button>
      <div
        className={
          compact
            ? "inline-flex gap-0.5 p-0.5 rounded-md bg-zinc-900/90 border border-zinc-800/90 light:bg-zinc-100 light:border-zinc-200 stage:bg-black stage:border-zinc-600"
            : "inline-flex gap-0.5 p-1 rounded-lg bg-zinc-900/90 border border-zinc-800/90 light:bg-zinc-100 light:border-zinc-200 stage:bg-black stage:border-zinc-600"
        }
        role="group"
        aria-label="Sync clock speed"
      >
        {AUTO_SCROLL_SPEEDS.map((s) => {
          const selected = speed === s
          return (
            <button
              key={s}
              type="button"
              aria-pressed={selected}
              aria-label={`Clock ${AUTO_SCROLL_SPEED_LABELS[s]}`}
              title={
                s === "slow"
                  ? "Clock 0.75×"
                  : s === "fast"
                    ? "Clock 1.2×"
                    : "Realtime clock"
              }
              onClick={() => onSpeedChange(s)}
              className={`${
                compact
                  ? "min-h-8 min-w-8 px-1.5 text-[11px]"
                  : "min-h-9 min-w-9 text-xs"
              } rounded-md font-bold tabular-nums tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                selected
                  ? "bg-indigo-600/35 text-indigo-100 light:bg-indigo-100 light:text-indigo-800 stage:bg-white stage:text-black"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 light:text-zinc-500 light:hover:text-zinc-900 light:hover:bg-white stage:text-zinc-400 stage:hover:text-white stage:hover:bg-zinc-900"
              }`}
            >
              {AUTO_SCROLL_SPEED_LABELS[s]}
            </button>
          )
        })}
      </div>
      <span
        className={`text-[10px] tabular-nums stage:text-zinc-400 ${
          pastLastCue
            ? "text-amber-300/90"
            : "text-zinc-500 light:text-zinc-600"
        }`}
        title={
          hasCues
            ? pastLastCue
              ? "Reached last sync cue — scroll holds here"
              : `${cueCount} section cue(s); stops at last`
            : "No section sync times yet"
        }
      >
        {hasCues ? (
          <>
            {elapsedLabel}
            {lastCueLabel ? ` / ${lastCueLabel}` : ""}
            <span className="mx-1 text-zinc-600">·</span>
            {cueCount} cue{cueCount === 1 ? "" : "s"}
          </>
        ) : (
          "No cues"
        )}
      </span>
    </div>
  )
}
