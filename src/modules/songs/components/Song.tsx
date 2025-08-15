
import type { Song as SongType } from "@/modules/songs/types/song.types"
import { SectionTag } from "@/modules/songs/components/SectionTag"
import { SectionChords } from "./SectionChords";


export interface TemporarySong extends Omit<SongType, 'id'>  {
    id?: string;
}

export interface Props {
    song: TemporarySong | SongType;
}

export const Song = ({song}: Props) => {
    return (
        <div 
            key={song.id ? song.id : null}
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
                        <SectionChords section={section} timeSignature={song.timeSignature} />
                    </li>
                    )
                )
            }
            </ul>
        </div>
    )
}