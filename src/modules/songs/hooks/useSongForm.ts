import { useReducer } from "react"
import { reducer, initialSong, type Action } from "../state/songFormReducer"

export const useSongForm = () => {
  const [state, dispatch] = useReducer(reducer, {
    song: initialSong,
    pendingSection: {
      id: "",
      type: "",
      bars: [],
    },
    pendingChordName: "",
    pendingBeats: String(initialSong.timeSignature.beatsPerMeasure),
    availableBeats: initialSong.timeSignature.beatsPerMeasure,
  })

  return { state, dispatch } as {
    state: typeof state
    dispatch: React.Dispatch<Action>
  }
}
