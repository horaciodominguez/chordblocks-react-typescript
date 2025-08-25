import { useReducer } from "react"
import { reducer, initialSong } from "../state/songFormReducer"

export const useSongForm = () => {
  const [state, dispatch] = useReducer(reducer, {
    song: initialSong,
    pendingSection: {
      id: "",
      type: "VERSE",
      bars: []
    },
    pendingChordName: "",
    pendingBeats: "4",
    availableBeats: 4
  })

  return { state, dispatch }
}