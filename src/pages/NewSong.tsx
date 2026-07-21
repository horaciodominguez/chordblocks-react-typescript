import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import { ROUTES } from "@/config/navigation"

export default function NewSong() {
  const navigate = useNavigate()
  const { addSong } = useSongs()

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await addSong(song)
    navigate(ROUTES.song(song.id), { replace: true })
  }

  return (
    <>
      <PageHeader title="New song" backTo={ROUTES.songs} />
      <SongForm
        handleAddSong={handleSubmit}
        onCancel={() => navigate(ROUTES.songs)}
      />
    </>
  )
}
