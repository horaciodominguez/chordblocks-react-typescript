import { type Song } from "../types/song"

interface Props {
  songs: Song[]
}

export function SongList ({songs}: Props) {
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