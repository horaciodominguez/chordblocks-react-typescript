import { Song } from "@/modules/songs/components/Song"
import { useParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"
import PageTitle from "@/components/ui/PageTitle"
import LoaderSpinner from "@/components/ui/LoaderSpinner"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const { song, loading } = useSong(id)

  if (!song) return <div>Song not found</div>

  return (
    <>
      <PageTitle>{song.title}</PageTitle>
      {loading && <LoaderSpinner />}
      <Song song={song} />
    </>
  )
}
