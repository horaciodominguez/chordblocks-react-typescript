type Props = {
  count: number
  active: number
  onChange: (index: number) => void
  /** Accessible name of the chord (e.g. "C"). */
  chordLabel?: string
}

/**
 * Voicing page dots — only render when count > 1.
 * Stop propagation so parent tile tap does not fire on dot press.
 */
export function VoicingDots({ count, active, onChange, chordLabel }: Props) {
  if (count <= 1) return null

  return (
    <div
      role="group"
      aria-label={
        chordLabel ? `Voicings for ${chordLabel}` : "Chord voicings"
      }
      className="mt-1 flex items-center justify-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {Array.from({ length: count }, (_, i) => {
        const selected = i === active
        return (
          <button
            key={i}
            type="button"
            aria-label={`Voicing ${i + 1} of ${count}`}
            aria-pressed={selected}
            title={`v${i + 1}`}
            onClick={() => onChange(i)}
            className={[
              "h-2.5 w-2.5 rounded-full transition",
              "min-h-9 min-w-9 sm:min-h-0 sm:min-w-0 sm:h-2.5 sm:w-2.5",
              "flex items-center justify-center",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
            ].join(" ")}
          >
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                selected
                  ? "bg-indigo-400 light:bg-indigo-600"
                  : "bg-zinc-600 hover:bg-zinc-400 light:bg-zinc-300 light:hover:bg-zinc-500",
              ].join(" ")}
            />
          </button>
        )
      })}
    </div>
  )
}
