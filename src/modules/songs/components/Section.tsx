import { Chord } from "@/modules/chords/components/Chord"
import type { TimeSignature } from "../types/song.types"
import { barWidthByTS } from "@/utils/widthByTS"
import type { SongSection } from "../types/section.types"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
}

export const Section = ({ section, timeSignature }: Props) => {
  return (
    <div className="SECTION-WRAP flex flex-wrap mb-4 border border-red-500">
      {section.bars.map((bar) => {
        const width = barWidthByTS(timeSignature.beatsPerMeasure)
        return (
          <div
            style={{ width }}
            key={bar.id}
            className="BAR-WRAP flex gap-2 divide-x-2 divide-blue-900"
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
