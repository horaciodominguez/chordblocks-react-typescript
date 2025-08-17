import { Chord } from "@/modules/chords/components/Chord"
import type { SongSection, TimeSignature } from "../types/song.types"

type Props = {
    section: SongSection,
    timeSignature: TimeSignature
}

export const Sections = ({section, timeSignature}: Props) => {
    return (
        <div className="flex p-2 flex-wrap border-2 border-white">
        { 
            //POR CADA COMPAS
            section.bars.map(
                bar => {
                    const width = timeSignature.beatsPerMeasure === 3
                                    || timeSignature.beatsPerMeasure === 6 ?
                                    `${100 / 3}%` : `${100 / 4}%`
                    return (
                        //CONTENEDOR DE COMPAS
                        <div style={{width}} key={bar.id} className="flex border-2 border-red-600">
                            {
                                bar.chords.map(
                                    chord => <Chord key={chord.id} chord={chord} timeSignature={timeSignature} />
                                )
                            }
                        </div>
                    )
                }
            )
        }
        </div>
    )
}