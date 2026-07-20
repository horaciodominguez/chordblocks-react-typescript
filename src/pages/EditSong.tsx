import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  isPlayModeParam,
  songViewPath,
} from "@/modules/repertoires/utils/repertoire.navigation"

export default function EditSong() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()

  const setContext = {
    repertoireId: searchParams.get("repertoireId") ?? undefined,
    itemId: searchParams.get("itemId") ?? undefined,
    mode: isPlayModeParam(searchParams.get("mode")) ? ("play" as const) : undefined,
  }
  const hasSetContext = Boolean(setContext.repertoireId && setContext.itemId)

  const parentPath = id
    ? songViewPath(id, hasSetContext ? setContext : null)
    : "/"

  const handleSubmit = async (nextSong: Song) => {
    if (!nextSong) return
    await updateSong(nextSong)
    navigate(songViewPath(nextSong.id, hasSetContext ? setContext : null), {
      replace: true,
    })
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Edit Song" backTo={parentPath} />
        <LoaderSpinner />
      </>
    )
  }

  if (!song) {
    return (
      <>
        <PageHeader title="Not found" backTo={parentPath} />
        <div className="text-center py-6">Song not found</div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Edit Song" backTo={parentPath} />
      <SongForm
        handleAddSong={handleSubmit}
        initialSong={song}
        onCancel={() =>
          navigate(songViewPath(song.id, hasSetContext ? setContext : null), {
            replace: true,
          })
        }
      />
    </>
  )
}
