import { Play } from "lucide-react"
import { formatSeconds } from "@/modules/songs/utils/youtube"

type Props = {
  label?: string
  /** Reference time (seconds) in the song's YouTube video. */
  refTime?: number
  /** When set together with refTime, the marker becomes a seek button. */
  onSeek?: () => void
}

/** Compact text marker for a riff placeholder block (Keep-style). */
export function RiffMarker({ label, refTime, onSeek }: Props) {
  const text = label?.trim() || "Riff"

  const labelEl = (
    <span className="inline-flex items-center justify-center text-xs font-semibold tracking-wide text-amber-300/90 sm:text-sm guide:text-[10px] guide:tracking-wide">
      {text}
    </span>
  )

  if (refTime === undefined || !onSeek) {
    return (
      <span title={text} aria-label={text} className="inline-flex">
        {labelEl}
      </span>
    )
  }

  const time = formatSeconds(refTime)

  return (
    <button
      type="button"
      onClick={onSeek}
      title={`${text} — listen at ${time}`}
      aria-label={`${text}, listen at ${time}`}
      className="inline-flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      {labelEl}
      <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-400/10 px-1.5 py-px text-[10px] font-semibold tabular-nums text-amber-300/90 hover:bg-amber-400/20 guide:text-[9px] guide:px-1">
        <Play size={8} aria-hidden />
        {time}
      </span>
    </button>
  )
}

export default RiffMarker
