import { Play } from "lucide-react"
import { formatSeconds } from "@/modules/songs/utils/youtube"

type Props = {
  /** Reference time (seconds) in the song's YouTube video. */
  refTime?: number
  /** When set together with refTime, the marker becomes a seek button. */
  onSeek?: () => void
}

/** Compact text marker for a solo placeholder block. */
export function SoloMarker({ refTime, onSeek }: Props) {
  const labelEl = (
    <span className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-violet-300/90 sm:text-sm guide:text-[10px] guide:tracking-wide">
      Solo
    </span>
  )

  if (refTime === undefined || !onSeek) {
    return (
      <span title="Solo" aria-label="Solo" className="inline-flex">
        {labelEl}
      </span>
    )
  }

  const time = formatSeconds(refTime)

  return (
    <button
      type="button"
      onClick={onSeek}
      title={`Solo — listen at ${time}`}
      aria-label={`Solo, listen at ${time}`}
      className="inline-flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      {labelEl}
      <span className="inline-flex items-center gap-0.5 rounded-full border border-violet-500/30 bg-violet-400/10 px-1.5 py-px text-[10px] font-semibold tabular-nums text-violet-300/90 hover:bg-violet-400/20 guide:text-[9px] guide:px-1">
        <Play size={8} aria-hidden />
        {time}
      </span>
    </button>
  )
}

export default SoloMarker
