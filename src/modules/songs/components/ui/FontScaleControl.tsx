import {
  ATRIL_FONT_SCALE_LABELS,
  ATRIL_FONT_SCALES,
  type AtrilFontScale,
} from "@/modules/songs/types/fontScale.types"

type Props = {
  value: AtrilFontScale
  onChange: (scale: AtrilFontScale) => void
  /** Slightly denser for sticky Play chrome. */
  compact?: boolean
}

/**
 * Atril text-size control — pill track like Settings SegmentedTabs,
 * without per-cell borders (avoids the “double line” on the selected chip).
 */
export function FontScaleControl({
  value,
  onChange,
  compact = false,
}: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 light:text-zinc-500 stage:text-zinc-400">
        Size
      </span>
      <div
        className={
          compact
            ? "inline-flex gap-0.5 p-0.5 rounded-md bg-zinc-900/90 border border-zinc-800/90 light:bg-zinc-100 light:border-zinc-200 stage:bg-black stage:border-zinc-600"
            : "inline-flex gap-0.5 p-1 rounded-lg bg-zinc-900/90 border border-zinc-800/90 shadow-sm shadow-black/20 light:bg-zinc-100 light:border-zinc-200 light:shadow-none stage:bg-black stage:border-zinc-600 stage:shadow-none"
        }
        role="group"
        aria-label="Chart text size"
      >
        {ATRIL_FONT_SCALES.map((scale) => {
          const selected = value === scale
          return (
            <button
              key={scale}
              type="button"
              aria-pressed={selected}
              aria-label={`Text size ${ATRIL_FONT_SCALE_LABELS[scale]}`}
              onClick={() => onChange(scale)}
              className={`${
                compact ? "min-h-8 min-w-8 text-[11px]" : "min-h-9 min-w-9 sm:min-w-10 text-xs"
              } rounded-md font-bold tabular-nums tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                selected
                  ? "bg-indigo-600/35 text-indigo-100 shadow-sm shadow-indigo-950/40 light:bg-indigo-100 light:text-indigo-800 light:shadow-none stage:bg-white stage:text-black stage:shadow-none"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 light:text-zinc-500 light:hover:text-zinc-900 light:hover:bg-white stage:text-zinc-400 stage:hover:text-white stage:hover:bg-zinc-900"
              }`}
            >
              {ATRIL_FONT_SCALE_LABELS[scale]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
