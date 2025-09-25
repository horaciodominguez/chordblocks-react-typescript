import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useNavigate } from "react-router-dom"

export default function NewSong() {
  const navigate = useNavigate()

  const { addSong } = useSongs()

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await addSong(song)
    navigate("/")
  }

  return (
    <>
      <h2 className="page-title mb-4">Add Song</h2>
      <SongForm handleAddSong={handleSubmit} />
    </>
  )
}
