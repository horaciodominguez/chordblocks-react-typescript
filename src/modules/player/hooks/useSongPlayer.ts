import { useContext } from "react"
import { SongPlayerContext } from "../context/playerContext"

/**
 * Access the song's reference player. Outside a SongPlayerProvider it returns
 * a no-op default (videoId null), so consumers degrade gracefully.
 */
export function useSongPlayer() {
  return useContext(SongPlayerContext)
}
