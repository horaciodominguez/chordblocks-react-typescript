import { Chord } from "@/modules/chords/components/Chord"
import type { TimeSignature } from "../types/song.types"
import { barWidthByTS, getGridColumns } from "@/utils/widthByTS"
import type { SongSection } from "../types/section.types"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
}

export const Section = ({ section, timeSignature }: Props) => {
  const gridPerMueasureValue = getGridColumns(timeSignature.beatsPerMeasure)
  return (
    <div
      className={`SECTION-WRAP grid grid-cols-${gridPerMueasureValue} divide-x-2 divide-blue-300 gap-2 mb-4 `}
    >
      {section.bars.map((bar) => {
        /* const width = barWidthByTS(timeSignature.beatsPerMeasure) */
        return (
          <div
            /* style={{ width }} */
            key={bar.id}
            className="BAR-WRAP flex gap-2 py-2 divide-x-2 divide-blue-900  "
          >
            {bar.chords.map((chord) => (
              <Chord
                key={chord.id}
                chord={chord}
                timeSignature={timeSignature}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
