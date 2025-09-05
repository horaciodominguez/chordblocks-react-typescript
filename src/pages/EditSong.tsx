import { SongForm } from "@/modules/songs/components/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { useParams, useNavigate } from "react-router-dom"

type Props = {
  songs: Song[]
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function EditSong({ songs, setSongs }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const song = songs.find((s) => s.id === id)
  if (!song) return <div>Song not found</div>

  const handleUpdate = (updated: Song) => {
    setSongs(songs.map((s) => (s.id === updated.id ? updated : s)))
    navigate(`/song/${updated.id}`)
  }

  return (
    <>
      <h2 className="text-gray-300 font-bold text-center">Edit Song</h2>
      <SongForm handleAddSong={handleUpdate} initialSong={song} />
    </>
  )
}
