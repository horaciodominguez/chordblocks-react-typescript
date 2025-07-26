import type React from "react"
import { type Song } from "../types/song"

interface Props {
  songs: Song[]
}

export const SongList: React.FC<Props> = ({songs}) => {
    return (
        <ul className="flex flex-col gap-4">
            {
            songs.map (
                song =>(
                    <li 
                        key={song.id} 
                         className="border border-gray-300 rounded-md p-4 shadow-sm"
                        >
                    <h3 className="font-medium">{song.title}</h3>
                    <p>{song.author}</p>
                    {
                    song.songSections.map (
                        (block, blockIndex) => (
                        <p 
                        key={blockIndex}
                        className="inline-block bg-blue-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-1"
                        >{block}</p>
                        )
                    )
                    }
                    </li>
                )
            )
            }
        </ul>
    )
}