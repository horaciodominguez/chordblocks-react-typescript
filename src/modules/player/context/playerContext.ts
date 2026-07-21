import { createContext } from "react"

export type SeekRequest = {
  seconds: number
  /** Increments on every request so repeated clicks on the same time re-seek. */
  nonce: number
}

export type SongPlayerContextValue = {
  /** YouTube video id of the current song, or null when no reference exists. */
  videoId: string | null
  isOpen: boolean
  seekRequest: SeekRequest | null
  /** Open the dock; optionally jump to a time (in seconds). */
  open: (seconds?: number) => void
  close: () => void
}

const noop = () => {}

const defaultValue: SongPlayerContextValue = {
  videoId: null,
  isOpen: false,
  seekRequest: null,
  open: noop,
  close: noop,
}

export const SongPlayerContext =
  createContext<SongPlayerContextValue>(defaultValue)
