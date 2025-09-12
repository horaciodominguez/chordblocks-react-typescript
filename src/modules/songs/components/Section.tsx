import { Chord } from "@/modules/chords/components/Chord"
import type { TimeSignature } from "../types/song.types"

import type { SongSection } from "../types/section.types"
import SectionBar from "@/modules/songs/components/ui/SectionBars"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
}

export const Section = ({ section, timeSignature }: Props) => {
  return (
    <SectionBar id={section.id} timeSignature={timeSignature}>
      {section.bars.map((bar) => {
        return (
          <div
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
    </SectionBar>
  )
}
