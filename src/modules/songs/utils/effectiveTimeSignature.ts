import type { TimeSignature } from "@/modules/songs/types/song.types"

/**
 * Section override wins; otherwise song default.
 * `sectionTs` omitted / undefined → song meter.
 */
export function effectiveTimeSignature(
  songTs: TimeSignature,
  sectionTs?: TimeSignature,
): TimeSignature {
  return sectionTs ?? songTs
}

export function formatTimeSignature(ts: TimeSignature): string {
  return `${ts.beatsPerMeasure}/${ts.noteValue}`
}
