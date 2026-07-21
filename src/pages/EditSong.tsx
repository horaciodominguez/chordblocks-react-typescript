import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import PageState from "@/components/ui/PageState"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  isPlayModeParam,
  songViewPath,
} from "@/modules/repertoires/utils/repertoire.navigation"
import { ROUTES } from "@/config/navigation"

export default function EditSong() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()

  const setContext = {
    repertoireId: searchParams.get("repertoireId") ?? undefined,
    itemId: searchParams.get("itemId") ?? undefined,
    mode: isPlayModeParam(searchParams.get("mode"))
      ? ("play" as const)
      : undefined,
  }
  const hasSetContext = Boolean(setContext.repertoireId && setContext.itemId)

  const parentPath = id
    ? songViewPath(id, hasSetContext ? setContext : null)
    : ROUTES.songs

  const handleSubmit = async (nextSong: Song) => {
    if (!nextSong) return
    await updateSong(nextSong)
    navigate(songViewPath(nextSong.id, hasSetContext ? setContext : null), {
      replace: true,
    })
  }

  if (loading) {
    return <PageState variant="loading" title="Loading…" backTo={parentPath} />
  }

  if (!song) {
    return (
      <PageState
        variant="notFound"
        message="Song not found"
        backTo={parentPath}
        backLabel="Go back"
        secondaryTo={ROUTES.songs}
        secondaryLabel="Songs"
      />
    )
  }

  return (
    <>
      <PageHeader title="Edit song" backTo={parentPath} />
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
