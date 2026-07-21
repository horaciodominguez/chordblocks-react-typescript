import { useEffect, useRef, useState } from "react"

/**
 * Minimal typings for the parts of the YouTube IFrame Player API we use.
 * https://developers.google.com/youtube/iframe_api_reference
 */
type YTPlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  destroy: () => void
}

type YTPlayerConstructor = new (
  element: HTMLElement,
  options: {
    videoId: string
    host?: string
    width?: string | number
    height?: string | number
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: () => void
      onError?: (event: { data: number }) => void
    }
  },
) => YTPlayer

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor }
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<void> | null = null

function loadIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve()
      }
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      script.async = true
      document.head.appendChild(script)
    })
  }
  return apiPromise
}

/** Embed disabled by the video owner (YouTube error codes). */
const EMBED_BLOCKED_CODES = [101, 150]

type Options = {
  videoId: string
  /** Called when the video cannot be embedded (owner disabled embedding). */
  onEmbedBlocked: () => void
}

/**
 * Creates a YouTube player (privacy-enhanced host) inside `containerRef`.
 * The player is destroyed on unmount, which also stops playback — required
 * by YouTube's policies (no hidden/background playback).
 */
export function useYouTubePlayer({ videoId, onEmbedBlocked }: Options) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [ready, setReady] = useState(false)

  const onEmbedBlockedRef = useRef(onEmbedBlocked)
  onEmbedBlockedRef.current = onEmbedBlocked

  useEffect(() => {
    let cancelled = false
    setReady(false)
    const container = containerRef.current

    loadIframeApi().then(() => {
      if (cancelled || !container || !window.YT) return

      // YT.Player replaces the target element with an iframe, so mount it on
      // a disposable child node instead of a React-managed one.
      const host = document.createElement("div")
      container.appendChild(host)

      playerRef.current = new window.YT.Player(host, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true)
          },
          onError: (event) => {
            if (!cancelled && EMBED_BLOCKED_CODES.includes(event.data)) {
              onEmbedBlockedRef.current()
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      try {
        playerRef.current?.destroy()
      } catch {
        // Player may already be gone (e.g. script failed to load).
      }
      playerRef.current = null
      if (container) container.innerHTML = ""
    }
  }, [videoId])

  const seekTo = (seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
    playerRef.current?.playVideo()
  }

  return { containerRef, ready, seekTo }
}
