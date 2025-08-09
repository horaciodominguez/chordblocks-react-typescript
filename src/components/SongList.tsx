
import { type Song as SongType } from "../types/song"
import { Song } from "./Song"

interface Props {
  songs: SongType[]
}

export const SongList = ({songs}: Props) => {
    return (
        <div className="flex flex-col gap-4">
            {
            songs.map (
                (song, i) =>(
                    <Song key={i} song={song} />
                )
            )
            }
        </div>
    )
}