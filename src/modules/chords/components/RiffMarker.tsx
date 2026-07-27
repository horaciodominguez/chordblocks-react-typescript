import {
  InstrumentalMarker,
  type InstrumentalKind,
} from "@/modules/chords/components/InstrumentalMarker"

type Props = {
  refTime?: number
  onSeek?: () => void
}

/** @deprecated Prefer InstrumentalMarker kind="riff" — kept as thin alias. */
export function RiffMarker(props: Props) {
  return <InstrumentalMarker kind={"riff" satisfies InstrumentalKind} {...props} />
}

export default RiffMarker
