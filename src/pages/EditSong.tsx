import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"
import { storage } from "@/services/storage"
import { useParams, useNavigate } from "react-router-dom"

type Props = {
  songs: Song[]
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function EditSong({ songs, setSongs }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { song, loading } = useSong(id)

  if (loading) return <div>Loading...</div>
  if (!song) return <div>Song not found</div>

  const handleUpdate = async (updated: Song) => {
    await storage.saveSong(updated)
    setSongs(songs.map((s) => (s.id === updated.id ? updated : s)))
    navigate(`/song/${updated.id}`)
  }

  return (
    <>
      <h2 className="page-title mb-4">Edit Song</h2>
      <SongForm handleAddSong={handleUpdate} initialSong={song} />
    </>
  )
}
