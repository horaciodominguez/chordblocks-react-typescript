import { Song } from "@/modules/songs/components/Song"
import type { Song as SongType } from "@/modules/songs/types/song.types"
import { useParams } from "react-router-dom"

type Props = {
  songs: SongType[]
}

export default function ViewSong({ songs }: Props) {
  const { id } = useParams<{ id: string }>()
  const song = songs.find((s) => s.id === id)

  if (!song) {
    return <div>Song not found</div>
  }

  return (
    <>
      <h2 className="text-gray-300 font-bold uppercase text-center mb-4 ">
        View Song
      </h2>
      <Song song={song} />
    </>
  )
}
