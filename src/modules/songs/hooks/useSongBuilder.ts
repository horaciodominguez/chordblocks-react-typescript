import { useReducer } from "react"
import { v4 as uuidv4 } from 'uuid'
import type {Song as SongType, SongSection, SectionType, TimeSignature, BarChord} from "@/modules/songs/types/song.types"
import { beatsCap, nextBeatsValue, remainingBeats } from "../utils/beats"

type State = {
  song: SongType
  pendingSection: SongSection
  pendingChordName: string
  pendingBeats: string,
  availableBeats: number
}

type Action =
  | { type: "SET_TITLE"; v: string }
  | { type: "SET_AUTHOR"; v: string }
  | { type: "SET_TIME_SIGNATURE"; v: TimeSignature }
  | { type: "ADD_SECTION_TYPE"; v: SectionType }
  | { type: "ADD_CHORD_NAME"; v: string }
  | { type: "ADD_BEATS"; v: string }
  | { type: "ADD_CHORD" }
  | { type: "DELETE_CHORD"; v: string }
  | { type: "REORDER_CHORDS_IN_BAR"; barId: string; order: string[] }
  | { type: "FINALIZE_SECTION" }
  | { type: "RESET" }


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

    case "ADD_CHORD":
      if (state.pendingSection.id === "" || state.pendingChordName === "" || state.pendingBeats === "") return state

      const bpm = state.song.timeSignature.beatsPerMeasure
      const beats = Math.max(1, parseInt(state.pendingBeats, 10) || 0)

      const chord: BarChord = {
        id: uuidv4(),
        name: state.pendingChordName,
        duration: beats
      }

      const bars = [...state.pendingSection.bars]
      const i = bars.length - 1

      if (i >= 0) {
        const last = bars[i]
        const rem = remainingBeats(last, bpm)
        if (beats <= rem) {
          const updatedLast = { ...last, chords: [...last.chords, chord] }
          bars[i] = updatedLast
        } else {
          bars.push({ id: uuidv4(), chords: [chord] })
        }
      } else {
        bars.push({ id: uuidv4(), chords: [chord] })
      }

      const lastAfter = bars[bars.length - 1]
      const availableBeats = beatsCap(bpm, remainingBeats(lastAfter, bpm))

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars },
        pendingChordName: "",
        pendingBeats: nextBeatsValue(availableBeats),
        availableBeats
      }

    case "DELETE_CHORD":
      if (state.pendingSection.id === "") return state
      const barsAfterDelete = state.pendingSection.bars.map(bar => ({
        ...bar,
        chords: bar.chords.filter(chord => chord.id !== action.v)
      })).filter(bar => bar.chords.length > 0)
      const lastAfterDelete = barsAfterDelete[barsAfterDelete.length - 1]
      const availableBeatsAfterDelete = lastAfterDelete 
        ? beatsCap(state.song.timeSignature.beatsPerMeasure, remainingBeats(lastAfterDelete, state.song.timeSignature.beatsPerMeasure)) 
        : state.song.timeSignature.beatsPerMeasure
      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: barsAfterDelete },
        availableBeats: availableBeatsAfterDelete,
        pendingBeats: nextBeatsValue(availableBeatsAfterDelete)
      }

    case "REORDER_CHORDS_IN_BAR":
      const { barId, order } = action
      return {
        ...state,
        pendingSection: {
          ...state.pendingSection,
          bars: state.pendingSection.bars.map(bar => {
            if (bar.id !== barId) return bar
            const byId = new Map(bar.chords.map(c => [c.id, c]))
            return { ...bar, chords: order.map(id => byId.get(id)!).filter(Boolean) }
          }),
        },
      }


    case "FINALIZE_SECTION":
      if (state.pendingSection.id === "") return state
      return {
        ...state,
        song: {
          ...state.song,
          songSections: [...state.song.songSections, state.pendingSection]
        },
        pendingSection: {
          id: "",
          type: "VERSE",
          bars: []
        },
        pendingChordName: "",
        pendingBeats: "4",
        availableBeats: state.song.timeSignature.beatsPerMeasure
      }
    case "RESET":
      return {
        song: initialState,
        pendingSection: {
          id: "",
          type: "VERSE",
          bars: []
        },
        pendingChordName: "",
        pendingBeats: "4",
        availableBeats: 4
      }

    default:
      return state
  }
}

export const useSongBuilder = () => {
  const [state, dispatch] = useReducer(reducer, {
    song: initialState,
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