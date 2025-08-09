
import { type Song } from "../types/song"
import { SectionTag } from "./SectionTag"

interface Props {
  songs: Song[]
}

export const SongList = ({songs}: Props) => {
    return (
        <ul className="flex flex-col gap-4">
            {
            songs.map (
                song =>(
                    <li 
                        key={song.id} 
                         className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md p-4 shadow-sm"
                        >
                        <h3 className="font-medium">{song.title}</h3>
                        <p>{song.author}</p>
                        <ul>
                        {
                        song.songSections.map (
                            (section, sectionIndex) => (

                            <li
                            key={sectionIndex}
                            
                            >
                                <SectionTag typeName={section.type} />
                                <div className="flex flex-wrap justify-items-start mb-2">
                                    {section.blocks.map(
                                        block => (
                                            block.chords.map(
                                                (chord, i) => (
                                                    
                                                    <div
                                                        key={i}
                                                        className="bg-blue-950 flex items-center justify-center py-4 mb-2"
                                                        style={{
                                                            width: `${(chord.beats / (song.timeSignature.beatsPerMeasure * 4)) * 100}%` // 4 compases por bloque
                                                        }}
                                                        >
                                                        {chord.name}
                                                    </div>
                                                )
                                            )
                                        )
                                    )}
                                </div>
                            </li>
                            )
                        )
                        }
                        </ul>
                    </li>
                )
            )
            }
        </ul>
    )
}