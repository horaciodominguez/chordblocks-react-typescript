import type { TimeSignature } from "../../types/song.types"

function getGridColumns(beatsPerMeasure: number): number {
  if (beatsPerMeasure === 2 || beatsPerMeasure === 4) {
    return 4
  }

  if (beatsPerMeasure === 3 || beatsPerMeasure === 5 || beatsPerMeasure === 6) {
    return 3
  }

  if (beatsPerMeasure >= 7) {
    return 1
  }
  return 1
}

interface Props {
  id?: string
  timeSignature: TimeSignature
  children: React.ReactNode
}

export default function SectionBars({ children, timeSignature }: Props) {
  const gridPerMueasureValue = getGridColumns(timeSignature.beatsPerMeasure)
  const classBars = `SECTIONBARS-WRAP grid divide-x-2 divide-blue-300 gap-2 mb-4 ${
    gridPerMueasureValue === 1
      ? "grid-cols-1"
      : gridPerMueasureValue === 2
      ? "grid-cols-2"
      : gridPerMueasureValue === 3
      ? "grid-cols-3"
      : gridPerMueasureValue === 4
      ? "grid-cols-4"
      : ""
  }`
  return (
    <>
      <div className={classBars}>{children}</div>
    </>
  )
}
