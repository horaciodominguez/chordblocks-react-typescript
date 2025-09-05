import { Link } from "react-router-dom"
import { type Song as SongType } from "@/modules/songs/types/song.types"

interface Props {
  songs: SongType[]
}

export const SongList = ({ songs }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="
          flex flex-col justify-start items-start gap-4 p-4
          border-[.1px] border-gray-700 bg-gray-50/5 rounded-md shadow-sm
          "
        >
          <h2>
            <Link className="" to={`/song/${song.id}`}>
              {song.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-400">{song.artist}</p>
          <div className="flex gap-4">
            <Link
              className="
                inline px-4 py-2 
                border-2 border-zinc-500/100 rounded-md text-sm text-gray-400 hover:text-gray-200"
              to={`/song/${song.id}`}
            >
              View
            </Link>
            <Link
              className="
                inline px-4 py-2 
                border-2 border-zinc-500/100 rounded-md text-sm text-gray-400 hover:text-gray-200"
              to={`/song/${song.id}/edit`}
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
