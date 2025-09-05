import { useReducer } from "react"
import { reducer, initialSong, type Action } from "../state/songFormReducer"

export const useSongForm = (baseSong?: typeof initialSong) => {
  const base = baseSong ?? initialSong
  const [state, dispatch] = useReducer(reducer, {
    song: base,
    pendingSection: {
      id: "",
      type: "",
      bars: [],
    },
    pendingChordName: "",
    pendingBeats: String(base.timeSignature.beatsPerMeasure),
    availableBeats: base.timeSignature.beatsPerMeasure,
    errors: {},
  })

  return { state, dispatch } as {
    state: typeof state
    dispatch: React.Dispatch<Action>
  }
}
