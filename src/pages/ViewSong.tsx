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
import {
  getSetNavContext,
  isPlayModeParam,
  setSongPath,
} from "@/modules/repertoires/utils/repertoire.navigation"
import { useWakeLock } from "@/modules/repertoires/hooks/useWakeLock"
import { Edit, ListMusic, Play } from "lucide-react"
import { useMemo } from "react"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { song, loading } = useSong(id)
  const { getRepertoire, repertoires } = useRepertoires()

  const repertoireId = searchParams.get("repertoireId")
  const itemId = searchParams.get("itemId")
  const playMode = isPlayModeParam(searchParams.get("mode"))

  const setNav = useMemo(() => {
    if (!repertoireId || !itemId) return null
    const repertoire = getRepertoire(repertoireId)
    if (!repertoire) return null
    return getSetNavContext(repertoire, itemId)
  }, [repertoireId, itemId, getRepertoire, repertoires])

  useWakeLock(playMode && !!setNav)

  const itemNotes = setNav?.current.item.notes?.trim() || ""
  const backTo = setNav ? `/repertoires/${setNav.repertoireId}` : "/"
  const preferHistory = !setNav

  if (loading) {
    return (
      <>
        <PageHeader
          title="Loading…"
          backTo={backTo}
          preferHistory={preferHistory}
        />
        <LoaderSpinner />
      </>
    )
  }

  if (!song) {
    return (
      <>
        <PageHeader
          title="Not found"
          backTo={backTo}
          preferHistory={preferHistory}
        />
        <div className="text-center py-6">Song not found</div>
        {setNav ? <SetSongNav nav={setNav} playMode={playMode} /> : null}
      </>
    )
  }

  const playHref =
    setNav &&
    setSongPath(song.id, setNav.repertoireId, setNav.current.item.id, {
      mode: "play",
    })

  return (
    <>
      <PageHeader
        title={song.title}
        backTo={backTo}
        preferHistory={preferHistory}
        actions={
          playMode ? null : (
            <>
              {setNav && playHref ? (
                <PageHeaderLink to={playHref}>
                  <Play size={16} />
                  <span className="hidden sm:inline">Play</span>
                </PageHeaderLink>
              ) : null}
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
          )
        }
      />

      {!playMode && setNav ? (
        <p className="text-xs text-zinc-500 mb-2 -mt-2">
          {setNav.repertoireTitle} · {setNav.current.index + 1} of{" "}
          {setNav.total}
        </p>
      ) : null}

      {itemNotes ? (
        <p
          className={`mb-3 text-sm whitespace-pre-wrap ${
            playMode
              ? "text-amber-200/90 -mt-1"
              : "text-amber-200/80 bg-amber-400/5 border border-amber-500/20 rounded-md px-3 py-2"
          }`}
        >
          {itemNotes}
        </p>
      ) : null}

      <div
        className={
          setNav
            ? playMode
              ? "pb-20"
              : "pb-24 md:pb-20"
            : undefined
        }
      >
        <Song
          song={song}
          baseSemitones={setNav?.current.item.transposeSemitones ?? 0}
          performanceMode={playMode}
        />
      </div>
      {setNav ? <SetSongNav nav={setNav} playMode={playMode} /> : null}
    </>
  )
}
