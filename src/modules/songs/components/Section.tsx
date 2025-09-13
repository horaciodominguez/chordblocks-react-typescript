import { Chord } from "@/modules/chords/components/Chord"
import type { TimeSignature } from "../types/song.types"

import type { SongSection } from "../types/section.types"
import SectionBars from "@/modules/songs/components/ui/SectionBars"
import SectionChords from "./ui/SectionChords"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
}

export const Section = ({ section, timeSignature }: Props) => {
  return (
    <SectionBars id={section.id} section={section}>
      {section.bars.map((bar) => {
        return (
          <SectionChords key={bar.id}>
            {bar.chords.map((chord) => (
              <Chord
                key={chord.id}
                chord={chord}
                timeSignature={timeSignature}
              />
            ))}
          </SectionChords>
        )
      })}
    </SectionBars>
  )
}
