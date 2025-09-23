import { Song } from "@/modules/songs/components/Song"
import { useParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const { song, loading } = useSong(id)

  if (loading) return <div>Loading...</div>
  if (!song) return <div>Song not found</div>

  return (
    <>
      <h2 className="page-title mb-4">View Song</h2>
      <Song song={song} />
    </>
  )
}
