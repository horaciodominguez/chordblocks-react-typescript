import { Song } from "@/modules/songs/components/Song"
import { useParams, useSearchParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import {
  PageHeader,
  PageHeaderLink,
} from "@/components/layout/PageHeader"
import { SetSongNav } from "@/modules/repertoires/components/SetSongNav"
import { getSetNavContext } from "@/modules/repertoires/utils/repertoire.navigation"
import { Edit, ListMusic } from "lucide-react"
import { useMemo } from "react"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { song, loading } = useSong(id)
  const { getRepertoire, repertoires } = useRepertoires()

  const repertoireId = searchParams.get("repertoireId")
  const itemId = searchParams.get("itemId")

  const setNav = useMemo(() => {
    if (!repertoireId || !itemId) return null
    const repertoire = getRepertoire(repertoireId)
    if (!repertoire) return null
    return getSetNavContext(repertoire, itemId)
  }, [repertoireId, itemId, getRepertoire, repertoires])

  const backTo = setNav
    ? `/repertoires/${setNav.repertoireId}`
    : "/"
  const preferHistory = !setNav

  if (loading) {
    return (
      <>
        <PageHeader title="Loading…" backTo={backTo} preferHistory={preferHistory} />
        <LoaderSpinner />
      </>
    )
  }

  if (!song) {
    return (
      <>
        <PageHeader title="Not found" backTo={backTo} preferHistory={preferHistory} />
        <div className="text-center py-6">Song not found</div>
        {setNav ? <SetSongNav nav={setNav} /> : null}
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={song.title}
        backTo={backTo}
        preferHistory={preferHistory}
        actions={
          <>
            {setNav ? (
              <PageHeaderLink
                to={`/repertoires/${setNav.repertoireId}`}
                className="hidden sm:inline-flex"
              >
                <ListMusic size={16} />
                <span>Set</span>
              </PageHeaderLink>
            ) : null}
            <PageHeaderLink to={`/song/${song.id}/edit`}>
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </PageHeaderLink>
          </>
        }
      />
      {setNav ? (
        <p className="text-xs text-zinc-500 mb-3 -mt-2">
          {setNav.repertoireTitle} · {setNav.current.index + 1} of{" "}
          {setNav.total}
        </p>
      ) : null}
      <div className={setNav ? "pb-24 md:pb-20" : undefined}>
        <Song
          song={song}
          baseSemitones={setNav?.current.item.transposeSemitones ?? 0}
        />
      </div>
      {setNav ? <SetSongNav nav={setNav} /> : null}
    </>
  )
}
