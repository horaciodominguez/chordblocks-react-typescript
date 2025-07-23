import type React from "react"
import { type Song } from "../types/song"

interface Props {
  songs: Song[]
}

export const SongList: React.FC<Props> = ({songs}) => {
    return (
        <ul>
            {
            songs.map (
                song =>(
                    <li key={song.id} >
                    <h3>{song.title}</h3>
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