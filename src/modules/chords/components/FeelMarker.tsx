import { feelMarkerLabel, type FeelMarkerId } from "@/modules/songs/constants/feel"

type Props = {
  feelId: FeelMarkerId
}

/** Compact dynamics / feel marker (stop, half-time, rit., …). */
export function FeelMarker({ feelId }: Props) {
  const text = feelMarkerLabel(feelId)
  return (
    <span
      title={text}
      aria-label={text}
      className="inline-flex items-center justify-center rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-rose-300/95 sm:text-sm guide:text-[length:var(--atril-marker,0.625rem)] guide:px-1.5 stage:text-white stage:border-white/40 stage:bg-white/10"
    >
      {text}
    </span>
  )
}

export default FeelMarker
