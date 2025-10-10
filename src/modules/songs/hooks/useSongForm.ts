import { useReducer } from "react"
import {
  reducer,
  initialSong,
  type Action,
  type SongFormState,
} from "../state/songFormReducer"

export type UseSongFormResult = {
  state: SongFormState
  dispatch: React.Dispatch<Action>
}

export const useSongForm = (
  baseSong?: typeof initialSong
): UseSongFormResult => {
  const base = baseSong ?? initialSong
  const [state, dispatch] = useReducer(reducer, {
    song: base,
    pendingSection: {
      id: "",
      type: "",
      bars: [],
    },
    pendingBlock: undefined,
    pendingBeats: String(base.timeSignature.beatsPerMeasure),
    availableBeats: base.timeSignature.beatsPerMeasure,
    errors: {},
    editingSectionId: null,
  })

  return { state, dispatch }
}
