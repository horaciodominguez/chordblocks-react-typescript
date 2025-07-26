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
                    <li key={song.id} className="border-2 p-4" >
                    <h3 className="font-medium">{song.title}</h3>
                    <p>{song.author}</p>
                    {
                    song.songSections.map (
                        (block, blockIndex) => (
                        <p key={blockIndex}>{block}</p>
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