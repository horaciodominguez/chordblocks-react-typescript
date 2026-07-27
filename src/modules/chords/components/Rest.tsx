import { restGlyphsForDuration } from "@/modules/chords/utils/restSymbols"

type Props = {
  duration: number
  beatsPerMeasure?: number
  /** Time-signature denominator (2, 4, or 8). Default 4. */
  noteValue?: number
}

export function Rest({
  duration,
  beatsPerMeasure = 4,
  noteValue = 4,
}: Props) {
  const glyphs = restGlyphsForDuration(duration, beatsPerMeasure, noteValue)
  const aria = glyphs.map((g) => g.label).join(", ")

  return (
    <span
      role="img"
      aria-label={aria}
      title={aria}
      className="inline-flex items-center justify-center gap-0.5 text-2xl"
      style={{ lineHeight: 1 }}
    >
      {glyphs.map((glyph, i) => (
        <span
          key={`${glyph.kind}-${glyph.dotted ? "d" : "p"}-${i}`}
          className="relative inline-flex items-center justify-center"
        >
          <svg
            className="h-6 w-6 text-white light:text-zinc-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            aria-hidden
          >
            <use
              href={`/assets/rests-sprite.svg#${glyph.kind}-rest`}
              width={24}
              height={24}
            />
          </svg>
          {glyph.dotted ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current"
            />
          ) : null}
        </span>
      ))}
      <span className="sr-only">{aria}</span>
    </span>
  )
}

export default Rest
