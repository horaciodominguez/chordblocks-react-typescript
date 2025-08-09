
import { Link } from "react-router-dom"
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
                    <div key={i} className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md shadow-sm">
                        <h2>
                            <Link className="block px-8 py-4" to={`/song/${song.id}`}>{song.title}</Link>
                        </h2>
                        {/* <Song song={song} /> */}
                    </div>
                )
            )
            }
        </div>
    )
}