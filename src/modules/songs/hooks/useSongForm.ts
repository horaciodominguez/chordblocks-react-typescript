import { useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  reducer,
  initialSong,
  type Action,
  type SongFormState,
} from "../state/songFormReducer"
import type { Song } from "@/modules/songs/types/song.types"

export type UseSongFormResult = {
  state: SongFormState
  dispatch: React.Dispatch<Action>
}

function freshNewSong(): Song {
  return {
    ...initialSong,
    id: uuidv4(),
    title: "",
    artist: "",
    genre: "",
    year: new Date().getFullYear(),
    imageUrl: null,
    imageBase64: null,
    songSections: [],
    timeSignature: { ...initialSong.timeSignature },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const useSongForm = (baseSong?: Song): UseSongFormResult => {
  const base = baseSong ?? freshNewSong()
  const [state, dispatch] = useReducer(reducer, {
    song: base,
    pendingSection: {
      id: "",
      type: "",
      bars: [],
      repeats: 1,
    },
    pendingBlock: undefined,
    pendingBeats: String(base.timeSignature.beatsPerMeasure),
    availableBeats: base.timeSignature.beatsPerMeasure,
    errors: {},
    editingSectionId: null,
  })

  return { state, dispatch }
}
