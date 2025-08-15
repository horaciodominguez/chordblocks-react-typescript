import { Chord } from "@/modules/chords/components/Chord"
import type { SongSection, TimeSignature } from "../types/song.types"

type Props = {
    section: SongSection,
    timeSignature: TimeSignature
}

export const SectionChords = ({section, timeSignature}: Props) => {
    return (
        <div className="flex flex-wrap justify-items-start mb-2">
            {
                section.chords.map(
                    (chord, i) => (
                        <Chord key={i} timeSignature={timeSignature} chord={chord} />
                    )
                )
            }
        </div>
    )
}