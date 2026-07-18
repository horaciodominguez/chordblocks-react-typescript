import { Song } from "@/modules/songs/components/Song"
import { useParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import {
  PageHeader,
  PageHeaderLink,
} from "@/components/layout/PageHeader"
import { Edit } from "lucide-react"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const { song, loading } = useSong(id)

  if (loading) {
    return (
      <>
        <PageHeader title="Loading…" backTo="/" />
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
      <PageHeader
        title={song.title}
        backTo="/"
        actions={
          <PageHeaderLink to={`/song/${song.id}/edit`}>
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </PageHeaderLink>
        }
      />
      <Song song={song} />
    </>
  )
}
