import { Play } from "lucide-react"
import { formatSeconds } from "@/modules/songs/utils/youtube"

export type InstrumentalKind = "riff" | "solo"

const STYLE: Record<
  InstrumentalKind,
  {
    text: string
    title: string
    textClass: string
    chipClass: string
  }
> = {
  riff: {
    text: "Riff",
    title: "Riff",
    textClass: "text-amber-300/90",
    chipClass:
      "border-amber-500/30 bg-amber-400/10 text-amber-300/90 hover:bg-amber-400/20",
  },
  solo: {
    text: "Solo",
    title: "Solo",
    textClass: "text-violet-300/90",
    chipClass:
      "border-violet-500/30 bg-violet-400/10 text-violet-300/90 hover:bg-violet-400/20",
  },
}

type Props = {
  kind: InstrumentalKind
  /** Reference time (seconds) in the song's YouTube video. */
  refTime?: number
  /** When set together with refTime, the marker becomes a seek button. */
  onSeek?: () => void
}

/**
 * Shared marker for instrumental placeholder blocks (riff / solo).
 * Same layout; color distinguishes kind. Future: score / notation inside.
 */
export function InstrumentalMarker({ kind, refTime, onSeek }: Props) {
  const style = STYLE[kind]

  const labelEl = (
    <span
      className={`inline-flex items-center justify-center text-xs font-semibold tracking-wide sm:text-sm guide:text-[length:var(--atril-marker,0.625rem)] guide:tracking-wide stage:text-white ${style.textClass} ${
        kind === "solo" ? "uppercase" : ""
      }`}
    >
      {style.text}
    </span>
  )

  if (refTime === undefined || !onSeek) {
    return (
      <span title={style.title} aria-label={style.title} className="inline-flex">
        {labelEl}
      </span>
    )
  }

  const time = formatSeconds(refTime)

  return (
    <button
      type="button"
      onClick={onSeek}
      title={`${style.title} — listen at ${time}`}
      aria-label={`${style.title}, listen at ${time}`}
      className="inline-flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      {labelEl}
      <span
        className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[10px] font-semibold tabular-nums guide:text-[9px] guide:px-1 ${style.chipClass}`}
      >
        <Play size={8} aria-hidden />
        {time}
      </span>
    </button>
  )
}

export default InstrumentalMarker
