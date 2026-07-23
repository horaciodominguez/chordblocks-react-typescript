const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/

/**
 * Extract the video id from a YouTube URL. Supports watch/shorts/embed paths,
 * youtu.be short links and links without protocol (as often pasted from notes).
 * Returns null when no valid video id can be found.
 */
export function parseYouTubeVideoId(url: string): string | null {
  const raw = url.trim()
  if (!raw) return null

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    return null
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "")

  if (host === "youtu.be") {
    const id = parsed.pathname.split("/")[1] ?? ""
    return VIDEO_ID_RE.test(id) ? id : null
  }

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com"
  ) {
    const v = parsed.searchParams.get("v")
    if (v && VIDEO_ID_RE.test(v)) return v

    const segments = parsed.pathname.split("/").filter(Boolean)
    if (
      segments.length === 2 &&
      (segments[0] === "embed" ||
        segments[0] === "shorts" ||
        segments[0] === "live")
    ) {
      return VIDEO_ID_RE.test(segments[1]) ? segments[1] : null
    }
  }

  return null
}

export function isValidYouTubeUrl(url: string): boolean {
  return parseYouTubeVideoId(url) !== null
}

/**
 * Parse a human time string into seconds.
 * Accepts "95" (seconds), "1:35" (m:ss) and "1:02:35" (h:mm:ss).
 * Returns null for anything else.
 */
export function parseTimeToSeconds(input: string): number | null {
  const raw = input.trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) return parseInt(raw, 10)

  const m = raw.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/)
  if (!m) return null

  const hours = m[1] ? parseInt(m[1], 10) : 0
  const minutes = parseInt(m[2], 10)
  const seconds = parseInt(m[3], 10)
  if (seconds > 59 || (m[1] !== undefined && minutes > 59)) return null

  return hours * 3600 + minutes * 60 + seconds
}

/** Format seconds as "m:ss" (or "h:mm:ss" past one hour). */
export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.floor(total))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const ss = String(seconds).padStart(2, "0")
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${ss}`
  return `${minutes}:${ss}`
}
