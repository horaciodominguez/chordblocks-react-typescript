import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"

import { useParams, useNavigate } from "react-router-dom"

import { useSongs } from "@/modules/songs/hooks/useSongs"
import PageTitle from "@/components/ui/PageTitle"
import LoaderSpinner from "@/components/ui/LoaderSpinner"

export default function EditSong() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await updateSong(song)
    navigate("/")
  }

  if (!song) return <div>Song not found</div>

  return (
    <>
      <PageTitle>Edit Song</PageTitle>
      {loading && <LoaderSpinner />}
      <SongForm handleAddSong={handleSubmit} initialSong={song} />
    </>
  )
}
