import { Song } from "@/modules/songs/components/Song"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import PageState from "@/components/ui/PageState"
import { PageHeader, PageHeaderLink } from "@/components/layout/PageHeader"
import { SetSongNav } from "@/modules/repertoires/components/SetSongNav"
import {
  getSetNavContext,
  isPlayModeParam,
  songEditPath,
  songPlayPath,
  songViewPath,
} from "@/modules/repertoires/utils/repertoire.navigation"
import { useWakeLock } from "@/modules/repertoires/hooks/useWakeLock"
import { WakeLockIndicator } from "@/modules/repertoires/components/WakeLockIndicator"
import { Edit, ListMusic, Play, X } from "lucide-react"
import { useMemo } from "react"
import { ROUTES } from "@/config/navigation"
import { normalizeArtistKey } from "@/modules/songs/utils/songCatalog"
import { parseYouTubeVideoId } from "@/modules/songs/utils/youtube"
import { SongPlayerProvider } from "@/modules/player/context/SongPlayerContext"
import {
  YouTubeDock,
  PlayerDockSpacer,
} from "@/modules/player/components/YouTubeDock"

export default function ViewSong() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { song, loading } = useSong(id)
  const { getRepertoire, repertoires } = useRepertoires()

  const repertoireId = searchParams.get("repertoireId")
  const itemId = searchParams.get("itemId")
  const playMode = isPlayModeParam(searchParams.get("mode"))
  const requestedSetContext = Boolean(repertoireId || itemId)

  const setNav = useMemo(() => {
    if (!repertoireId || !itemId) return null
    const repertoire = getRepertoire(repertoireId)
    if (!repertoire) return null
    return getSetNavContext(repertoire, itemId)
  }, [repertoireId, itemId, getRepertoire, repertoires])

  const invalidSetContext = requestedSetContext && !setNav

  const wakeLock = useWakeLock(playMode)

  const itemNotes = setNav?.current.item.notes?.trim() || ""
  const backTo = setNav ? ROUTES.set(setNav.repertoireId) : ROUTES.songs
  // Exit Play → same song in normal view (keep Set context when present).
  const exitPlayTo = song
    ? songViewPath(
        song.id,
        setNav
          ? {
              repertoireId: setNav.repertoireId,
              itemId: setNav.current.item.id,
            }
          : null,
      )
    : backTo

  if (loading) {
    return <PageState variant="loading" backTo={backTo} />
  }

  if (!song) {
    return (
      <>
        <PageState
          variant="notFound"
          message="Song not found"
          backTo={backTo}
          backLabel="Back to songs"
          secondaryTo={ROUTES.sets}
          secondaryLabel="Sets"
        />
        {setNav ? <SetSongNav nav={setNav} playMode={playMode} /> : null}
      </>
    )
  }

  const playHref = songPlayPath(
    song.id,
    setNav
      ? {
          repertoireId: setNav.repertoireId,
          itemId: setNav.current.item.id,
        }
      : null,
  )

  const editHref = songEditPath(song.id, {
    repertoireId: setNav?.repertoireId,
    itemId: setNav?.current.item.id,
  })

  // Reference player is hidden in play mode (atril): no accidental playback live.
  const videoId =
    !playMode && song.youtubeUrl ? parseYouTubeVideoId(song.youtubeUrl) : null

  // Keep the dock above SetSongNav (and the mobile BottomNav) when present.
  const dockBottomClass = setNav
    ? "bottom-[calc(7.75rem+env(safe-area-inset-bottom))] md:bottom-[4.5rem]"
    : undefined

  return (
    <SongPlayerProvider videoId={videoId}>
      <PageHeader
        title={song.title}
        backTo={playMode ? exitPlayTo : backTo}
        actions={
          playMode ? (
            <>
              <WakeLockIndicator status={wakeLock} />
              <PageHeaderLink to={exitPlayTo} aria-label="Exit play mode">
                <X size={16} />
                <span className="hidden sm:inline">Exit</span>
              </PageHeaderLink>
            </>
          ) : (
            <>
              <PageHeaderLink to={playHref} aria-label="Enter play mode">
                <Play size={16} />
                <span className="hidden sm:inline">Play</span>
              </PageHeaderLink>
              {setNav ? (
                <PageHeaderLink
                  to={ROUTES.set(setNav.repertoireId)}
                  className="hidden sm:inline-flex"
                >
                  <ListMusic size={16} />
                  <span>Set</span>
                </PageHeaderLink>
              ) : null}
              <PageHeaderLink to={editHref}>
                <Edit size={16} />
                <span className="hidden sm:inline">Edit</span>
              </PageHeaderLink>
            </>
          )
        }
      />

      {invalidSetContext ? (
        <div className="mb-3 rounded-md border border-amber-500/30 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
          Set context is invalid or incomplete. Showing the song from your
          library.{" "}
          <Link to={ROUTES.sets} className="underline hover:text-amber-100">
            Back to sets
          </Link>
        </div>
      ) : null}

      {!playMode && setNav ? (
        <p className="text-xs text-zinc-500 mb-2 -mt-2 light:text-zinc-600">
          {setNav.repertoireTitle} · {setNav.current.index + 1} of{" "}
          {setNav.total}
        </p>
      ) : null}

      {itemNotes ? (
        <p
          className={`mb-3 text-sm whitespace-pre-wrap ${
            playMode
              ? "text-amber-200/90 -mt-1 stage:text-white"
              : "text-amber-200/80 bg-amber-400/5 border border-amber-500/20 rounded-md px-3 py-2"
          }`}
        >
          {itemNotes}
        </p>
      ) : null}

      <div
        className={setNav ? (playMode ? "pb-20" : "pb-24 md:pb-20") : undefined}
      >
        <Song
          song={song}
          baseSemitones={setNav?.current.item.transposeSemitones ?? 0}
          performanceMode={playMode}
          artistHref={`${ROUTES.songs}?view=artists&artist=${encodeURIComponent(normalizeArtistKey(song.artist))}`}
        />
        <PlayerDockSpacer />
      </div>
      {setNav ? <SetSongNav nav={setNav} playMode={playMode} /> : null}
      <YouTubeDock bottomClass={dockBottomClass} />
    </SongPlayerProvider>
  )
}
