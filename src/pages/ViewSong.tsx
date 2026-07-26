import { Song } from "@/modules/songs/components/Song"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useSong } from "@/modules/songs/hooks/useSong"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import PageState from "@/components/ui/PageState"
import { PageHeader, PageHeaderLink } from "@/components/layout/PageHeader"
import { PlayChrome } from "@/components/layout/PlayChrome"
import { SetSongNav } from "@/modules/repertoires/components/SetSongNav"
import { SetItemNotes } from "@/modules/repertoires/components/SetItemNotes"
import {
  getSetNavContext,
  isPlayModeParam,
  setSongPath,
  songEditPath,
  songPlayPath,
  songViewPath,
} from "@/modules/repertoires/utils/repertoire.navigation"
import { useWakeLock } from "@/modules/repertoires/hooks/useWakeLock"
import { useFullscreen } from "@/modules/repertoires/hooks/useFullscreen"
import { usePlayGestures } from "@/modules/repertoires/hooks/usePlayGestures"
import { WakeLockIndicator } from "@/modules/repertoires/components/WakeLockIndicator"
import { FullscreenToggle } from "@/modules/repertoires/components/FullscreenToggle"
import { GigLockToggle } from "@/modules/repertoires/components/GigLockToggle"
import { useGigLock } from "@/modules/repertoires/context/GigLockContext"
import { PrintChartButton } from "@/components/ui/PrintChartButton"
import { PLAY_SHELL_WIDTH_CLASS } from "@/config/layout"
import { FontScaleControl } from "@/modules/songs/components/ui/FontScaleControl"
import { StageModeToggle } from "@/modules/songs/components/ui/StageModeToggle"
import { AutoScrollControl } from "@/modules/songs/components/ui/AutoScrollControl"
import {
  readAtrilFontScale,
  writeAtrilFontScale,
} from "@/modules/songs/utils/fontScalePreference"
import {
  readStageMode,
  writeStageMode,
} from "@/modules/songs/utils/stageModePreference"
import {
  readAutoScrollPreference,
  writeAutoScrollPreference,
} from "@/modules/songs/utils/autoScrollPreference"
import type { AutoScrollSpeed } from "@/modules/songs/types/autoScroll.types"
import type { AtrilFontScale } from "@/modules/songs/types/fontScale.types"
import { usePlayAutoScroll } from "@/modules/repertoires/hooks/usePlayAutoScroll"
import { Edit, ListMusic, Play, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  const navigate = useNavigate()
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
  const fullscreen = useFullscreen()
  const { locked: gigLocked } = useGigLock()
  const playChromeRef = useRef<HTMLDivElement | null>(null)

  const goNextInSet = useCallback(() => {
    if (!setNav?.next) return
    navigate(
      setSongPath(
        setNav.next.item.songId,
        setNav.repertoireId,
        setNav.next.item.id,
        { mode: "play" },
      ),
    )
  }, [navigate, setNav])

  const goPrevInSet = useCallback(() => {
    if (!setNav?.prev) return
    navigate(
      setSongPath(
        setNav.prev.item.songId,
        setNav.repertoireId,
        setNav.prev.item.id,
        { mode: "play" },
      ),
    )
  }, [navigate, setNav])

  const [fontScale, setFontScale] = useState<AtrilFontScale>(() =>
    readAtrilFontScale(),
  )
  const [stageMode, setStageMode] = useState(() => readStageMode())
  const [autoScrollPrefs, setAutoScrollPrefs] = useState(() =>
    readAutoScrollPreference(),
  )
  const { surfaceRef, gestureProps } = usePlayGestures({
    enabled: playMode,
    onSwipeNext: setNav ? goNextInSet : undefined,
    onSwipePrev: setNav ? goPrevInSet : undefined,
    chromeInsetRef: playChromeRef,
  })
  const autoScroll = usePlayAutoScroll({
    playMode,
    speed: autoScrollPrefs.speed,
    sections: song?.songSections ?? [],
    chromeInsetRef: playChromeRef,
    chartRootRef: surfaceRef,
  })

  useEffect(() => {
    if (!playMode) return
    setFontScale(readAtrilFontScale())
    setStageMode(readStageMode())
    setAutoScrollPrefs(readAutoScrollPreference())
  }, [playMode])

  useEffect(() => {
    if (playMode) return
    if (fullscreen.active) void fullscreen.exit()
  }, [playMode, fullscreen.active, fullscreen.exit])

  const setFontScaleAndPersist = (next: AtrilFontScale) => {
    setFontScale(next)
    writeAtrilFontScale(next)
  }

  const setStageModeAndPersist = (next: boolean) => {
    setStageMode(next)
    writeStageMode(next)
  }

  const setAutoScrollSpeed = (speed: AutoScrollSpeed) => {
    setAutoScrollPrefs((prev) => {
      const next = { ...prev, speed }
      writeAutoScrollPreference(next)
      return next
    })
  }

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

  const headerActions = playMode ? (
    <>
      <PrintChartButton compact />
      <GigLockToggle compact />
      <WakeLockIndicator status={wakeLock} compact />
      <FullscreenToggle
        compact
        active={fullscreen.active}
        supported={fullscreen.supported}
        onToggle={() => void fullscreen.toggle()}
      />
      <PageHeaderLink to={exitPlayTo} aria-label="Exit play mode" compact>
        <X size={14} />
      </PageHeaderLink>
    </>
  ) : (
    <>
      <PrintChartButton />
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
      {gigLocked ? (
        <GigLockToggle />
      ) : (
        <PageHeaderLink to={editHref}>
          <Edit size={16} />
          <span className="hidden sm:inline">Edit</span>
        </PageHeaderLink>
      )}
    </>
  )

  return (
    <SongPlayerProvider videoId={videoId}>
      {/* Tall wrapper: sticky PlayChrome + chart must share one parent. */}
      <div>
        {playMode ? (
          <PlayChrome
            ref={playChromeRef}
            header={
              <PageHeader
                compact
                title={song.title}
                backTo={exitPlayTo}
                actions={headerActions}
              />
            }
            atrilControls={
              <>
                <FontScaleControl
                  compact
                  value={fontScale}
                  onChange={setFontScaleAndPersist}
                />
                <StageModeToggle
                  compact
                  enabled={stageMode}
                  onChange={setStageModeAndPersist}
                />
                <AutoScrollControl
                  compact
                  runState={autoScroll.runState}
                  speed={autoScrollPrefs.speed}
                  hasCues={autoScroll.hasCues}
                  cueCount={autoScroll.cueCount}
                  elapsedLabel={autoScroll.elapsedLabel}
                  lastCueLabel={autoScroll.lastCueLabel}
                  pastLastCue={autoScroll.pastLastCue}
                  onToggleRun={autoScroll.toggle}
                  onSpeedChange={setAutoScrollSpeed}
                />
              </>
            }
            notes={itemNotes}
          />
        ) : (
          <div className="no-print">
            <PageHeader
              title={song.title}
              backTo={backTo}
              actions={headerActions}
            />
            {itemNotes ? <SetItemNotes notes={itemNotes} /> : null}
            {invalidSetContext ? (
              <div className="mb-3 rounded-md border border-amber-500/30 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
                Set context is invalid or incomplete. Showing the song from your
                library.{" "}
                <Link
                  to={ROUTES.sets}
                  className="underline hover:text-amber-100"
                >
                  Back to sets
                </Link>
              </div>
            ) : null}
            {setNav ? (
              <p className="text-xs text-zinc-500 mb-2 -mt-2 light:text-zinc-600">
                {setNav.repertoireTitle} · {setNav.current.index + 1} of{" "}
                {setNav.total}
              </p>
            ) : null}
          </div>
        )}

        {playMode && invalidSetContext ? (
          <div
            className={`${PLAY_SHELL_WIDTH_CLASS} px-3 md:px-5 lg:px-6 no-print mb-3`}
          >
            <div className="rounded-md border border-amber-500/30 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
              Set context is invalid or incomplete. Showing the song from your
              library.{" "}
              <Link to={ROUTES.sets} className="underline hover:text-amber-100">
                Back to sets
              </Link>
            </div>
          </div>
        ) : null}

        <div
          data-print-root=""
          ref={playMode ? surfaceRef : undefined}
          {...(playMode ? gestureProps : {})}
          className={[
            playMode ? `${PLAY_SHELL_WIDTH_CLASS} px-3 md:px-5 lg:px-6 py-2` : "",
            setNav ? (playMode ? "pb-20" : "pb-24 md:pb-20") : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined}
        >
          <header className="hidden print:block mb-3">
            <h1>{song.title}</h1>
            <p className="print-meta">
              {song.artist}
              {song.mainKey ? ` · Key ${song.mainKey}` : ""}
              {song.bpm ? ` · ${song.bpm} BPM` : ""}
              {` · ${song.timeSignature.beatsPerMeasure}/${song.timeSignature.noteValue}`}
              {itemNotes ? ` · Cue: ${itemNotes}` : ""}
            </p>
          </header>
          <Song
            song={song}
            baseSemitones={setNav?.current.item.transposeSemitones ?? 0}
            performanceMode={playMode}
            artistHref={`${ROUTES.songs}?view=artists&artist=${encodeURIComponent(normalizeArtistKey(song.artist))}`}
            atril={
              playMode
                ? {
                    fontScale,
                    onFontScaleChange: setFontScaleAndPersist,
                    stageMode,
                    onStageModeChange: setStageModeAndPersist,
                    externalToolbar: true,
                  }
                : undefined
            }
          />
          <div className="no-print">
            <PlayerDockSpacer />
          </div>
        </div>
      </div>
      {setNav ? <SetSongNav nav={setNav} playMode={playMode} /> : null}
      <YouTubeDock bottomClass={dockBottomClass} />
    </SongPlayerProvider>
  )
}
