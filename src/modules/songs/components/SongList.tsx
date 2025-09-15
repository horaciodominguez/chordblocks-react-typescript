import { Link } from "react-router-dom"
import { type Song as SongType } from "@/modules/songs/types/song.types"
import { AudioLines, Edit } from "lucide-react"

interface Props {
  songs: SongType[]
}

export const SongList = ({ songs }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="
          flex flex-col justify-start items-start gap-4 
           rounded-md shadow-sm

          p-[.1px] 
          bg-gradient-to-br from-indigo-700/50 
          to-indigo-900/70
          hover:from-indigo-600/85
          box-border
          "
        >
          <div className="rounded-md bg-zinc-900/90 backdrop-filter backdrop-blur-md p-6 w-full">
            <h2 className="mb-4">
              <Link
                className="uppercase font-bold text-gray-200"
                to={`/song/${song.id}`}
              >
                {song.title}
              </Link>
            </h2>
            <h3 className="text-sm text-gray-400 mb-4">
              Artist: {song.artist}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Time Measure: {song.timeSignature.beatsPerMeasure} /{" "}
              {song.timeSignature.noteValue}
            </p>
            <div className="flex justify-end gap-4">
              <Link
                className="
                flex 
                justify-center items-center
                px-2 py-2 
                border-1 border-zinc-800 rounded-md text-sm text-gray-400 hover:text-gray-200"
                to={`/song/${song.id}`}
              >
                <AudioLines width={16} height={16} />
              </Link>
              <Link
                className="
                flex 
                justify-center items-center
                px-2 py-2 
                border-1 border-zinc-800 rounded-md text-sm text-gray-400 hover:text-gray-200"
                to={`/song/${song.id}/edit`}
              >
                <Edit width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
