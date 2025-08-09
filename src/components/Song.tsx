import type { Song as SongType } from "../types/song"
import { Block } from "./Block"
import { SectionTag } from "./SectionTag"

type Props = {
    song: SongType
}

export const Song = ({song}: Props) => {
    return (
        <div 
            key={song.id} 
            className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md p-4 shadow-sm"
            >
            <h3 className="font-medium">{song.title}</h3>
            <p>{song.author}</p>
            <ul>
            {
            song.songSections.map (
                (section, sectionIndex) => (

                <li key={sectionIndex} >
                    <SectionTag typeName={section.type} />
                    <div className="flex flex-wrap justify-items-start mb-2">
                        {section.blocks.map(
                            block => (
                                block.chords.map(
                                    (chord, i) => (
                                        <Block key={i} song={song} chord={chord} />
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
        </div>
    )
}