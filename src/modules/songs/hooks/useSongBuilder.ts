import { useReducer } from "react"
import { v4 as uuidv4 } from 'uuid'
import type {Song as SongType, SongSection, SectionType, TimeSignature} from "@/modules/songs/types/song.types";

type State = {
  song: SongType
  pendingSection: SongSection
  pendingChordName: string
  pendingBeats: string
}

type Action =
  | { type: "SET_TITLE"; v: string }
  | { type: "SET_AUTHOR"; v: string }
  | { type: "SET_TIME_SIGNATURE"; v: TimeSignature }
  | { type: "ADD_SECTION_TYPE"; v: SectionType }
  | { type: "ADD_CHORD_NAME"; v: string }
  | { type: "ADD_BEATS"; v: string }


const initialState: SongType  = {
  id: uuidv4(),
  title: "",
  author: "",
  timeSignature: {
    beatsPerMeasure: 4,
    noteValue: 4
  },
  songSections: [] as SongSection[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, song: { ...state.song, title: action.v } }
    case "SET_AUTHOR":
      return { ...state, song: { ...state.song, author: action.v } }
    case "SET_TIME_SIGNATURE":
      return {
        ...state,
        song: {
          ...state.song,
          timeSignature: { ...state.song.timeSignature, ...action.v }
        }
      }
    case "ADD_SECTION_TYPE":
      const newSection: SongSection = {
        id: uuidv4(),
        type: action.v,
        bars: []
      }
      return {
        ...state,
        pendingSection: newSection
      }
    case "ADD_CHORD_NAME":
      return { ...state, pendingChordName: action.v }
    case "ADD_BEATS":
      return { ...state, pendingBeats: action.v }
    default:
      return state
  }
}

export const useSongBuilder = () => {
  const [state, dispatch] = useReducer(reducer, { song: initialState, pendingSection: { id: "", type: "VERSE", bars: [] }, pendingChordName: "", pendingBeats: "" })

  return { state, dispatch }
}