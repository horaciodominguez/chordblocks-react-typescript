import { useEffect, useRef, useState } from "react"
import { X, Youtube } from "lucide-react"
import type { SeekRequest } from "../context/playerContext"
import { useSongPlayer } from "../hooks/useSongPlayer"
import { useYouTubePlayer } from "../hooks/useYouTubePlayer"

type Props = {
  /** Tailwind classes positioning the dock above other fixed bottom bars. */
  bottomClass?: string
}

const DEFAULT_BOTTOM_CLASS =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom))] md:bottom-0"

/**
 * Fixed bottom dock with the YouTube reference player.
 * Renders only while open; unmounting destroys the player so closing always
 * stops playback (YouTube policies forbid hidden/background playback).
 * The video area stays at least 200px tall per YouTube's embed requirements.
 */
export function YouTubeDock({ bottomClass = DEFAULT_BOTTOM_CLASS }: Props) {
  const { videoId, isOpen, close, seekRequest } = useSongPlayer()

  if (!isOpen || !videoId) return null

  return (
    <DockPanel
      videoId={videoId}
      seekRequest={seekRequest}
      onClose={close}
      bottomClass={bottomClass}
    />
  )
}

function DockPanel({
  videoId,
  seekRequest,
  onClose,
  bottomClass,
}: {
  videoId: string
  seekRequest: SeekRequest | null
  onClose: () => void
  bottomClass: string
}) {
  const [embedBlocked, setEmbedBlocked] = useState(false)
  const { containerRef, ready, seekTo } = useYouTubePlayer({
    videoId,
    onEmbedBlocked: () => setEmbedBlocked(true),
  })

  const lastNonceRef = useRef(0)

  useEffect(() => {
    if (!ready || !seekRequest) return
    if (seekRequest.nonce === lastNonceRef.current) return
    lastNonceRef.current = seekRequest.nonce
    seekTo(seekRequest.seconds)
    // seekTo is stable enough for this effect (refs under the hood).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, seekRequest])

  return (
    <div
      role="region"
      aria-label="YouTube reference player"
      className={`fixed inset-x-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md light:border-zinc-200 light:bg-white/95 ${bottomClass}`}
    >
      <div className="max-w-3xl mx-auto px-4 pt-2 pb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 light:text-zinc-600">
            <Youtube size={14} className="text-red-500" />
            Reference
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close player"
            className="flex items-center justify-center min-h-9 min-w-9 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 light:text-zinc-600 light:hover:text-zinc-900 light:hover:bg-zinc-100"
          >
            <X size={16} />
          </button>
        </div>

        {embedBlocked ? (
          <div className="rounded-md border border-amber-500/30 bg-amber-400/5 px-3 py-4 text-sm text-amber-200/90 text-center light:text-amber-800">
            This video can't be played here.{" "}
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-amber-100 light:hover:text-amber-900"
            >
              Watch on YouTube
            </a>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="h-[200px] w-full max-w-[420px] mx-auto overflow-hidden rounded-md bg-black"
          />
        )}
      </div>
    </div>
  )
}

/**
 * In-flow spacer so page content isn't hidden behind the fixed dock.
 * Place after the song content, inside the SongPlayerProvider.
 */
export function PlayerDockSpacer() {
  const { isOpen, videoId } = useSongPlayer()
  if (!isOpen || !videoId) return null
  return <div aria-hidden className="h-72" />
}
