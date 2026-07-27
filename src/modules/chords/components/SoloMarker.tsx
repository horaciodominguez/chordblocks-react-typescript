import {
  InstrumentalMarker,
  type InstrumentalKind,
} from "@/modules/chords/components/InstrumentalMarker"

type Props = {
  refTime?: number
  onSeek?: () => void
}

/** @deprecated Prefer InstrumentalMarker kind="solo" — kept as thin alias. */
export function SoloMarker(props: Props) {
  return <InstrumentalMarker kind={"solo" satisfies InstrumentalKind} {...props} />
}

export default SoloMarker
