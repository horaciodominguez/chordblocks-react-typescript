import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useNavigate } from "react-router-dom"
import PageTitle from "@/components/ui/PageTitle"

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
      <PageTitle>Add Song</PageTitle>
      <SongForm handleAddSong={handleSubmit} />
    </>
  )
}
