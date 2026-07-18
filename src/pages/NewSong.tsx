import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"

export default function NewSong() {
  const navigate = useNavigate()
  const { addSong } = useSongs()

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await addSong(song)
    navigate(`/song/${song.id}`)
  }

  return (
    <>
      <PageHeader title="Add Song" backTo="/" />
      <SongForm
        handleAddSong={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </>
  )
}
