import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"
import { useParams, useNavigate } from "react-router-dom"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { PageHeader } from "@/components/layout/PageHeader"

export default function EditSong() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await updateSong(song)
    navigate(`/song/${song.id}`)
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Edit Song" backTo="/" />
        <LoaderSpinner />
      </>
    )
  }

  if (!song) {
    return (
      <>
        <PageHeader title="Not found" backTo="/" />
        <div className="text-center py-6">Song not found</div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Edit Song" backTo={`/song/${song.id}`} />
      <SongForm
        handleAddSong={handleSubmit}
        initialSong={song}
        onCancel={() => navigate(`/song/${song.id}`)}
      />
    </>
  )
}
