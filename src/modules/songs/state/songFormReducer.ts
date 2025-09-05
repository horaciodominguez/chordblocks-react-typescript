import { v4 as uuidv4 } from "uuid"

import type {
  Song as SongType,
  TimeSignature,
} from "@/modules/songs/types/song.types"

import { beatsCap, nextBeatsValue, remainingBeats } from "../utils/beats"
import type {
  SectionType,
  SongSection,
  PendingSongSection,
} from "../types/section.types"
import type { BarChord } from "../types/bar.types"

export type SongFormState = {
  song: SongType
  pendingSection: PendingSongSection
  pendingChordName: string
  pendingBeats: string
  availableBeats: number
  errors: {
    title?: string
    artist?: string
    timeSignature?: string
    songSections?: string
  }
}

export type Action =
  | { type: "SET_TITLE"; v: string }
  | { type: "SET_ARTIST"; v: string }
  | { type: "SET_TIME_SIGNATURE"; v: TimeSignature }
  | { type: "ADD_SECTION_TYPE"; v: SectionType }
  | { type: "ADD_CHORD_NAME"; v: string }
  | { type: "ADD_BEATS"; v: string }
  | { type: "ADD_CHORD" }
  | { type: "DELETE_CHORD"; v: string }
  | { type: "REORDER_CHORDS_IN_BAR"; barId: string; order: string[] }
  | { type: "CANCEL_SECTION" }
  | { type: "FINALIZE_SECTION" }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; v: Partial<SongFormState["errors"]> }
  | { type: "CLEAR_ERROR"; field: keyof SongFormState["errors"] }

export const initialSong: SongType = {
  id: uuidv4(),
  title: "",
  artist: "",
  timeSignature: {
    beatsPerMeasure: 4,
    noteValue: 4,
  },
  songSections: [] as SongSection[],
}

export const reducer = (
  state: SongFormState,
  action: Action
): SongFormState => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, song: { ...state.song, title: action.v } }

    case "SET_ARTIST":
      return { ...state, song: { ...state.song, artist: action.v } }

    case "SET_TIME_SIGNATURE":
      return {
        ...state,
        song: {
          ...state.song,
          timeSignature: { ...state.song.timeSignature, ...action.v },
        },
      }

    case "ADD_SECTION_TYPE":
      if (state.pendingSection.id !== "") return state

      const newSection: PendingSongSection = {
        id: uuidv4(),
        type: action.v,
        bars: [],
      }
      return {
        ...state,
        pendingBeats: state.song.timeSignature.beatsPerMeasure.toString(),
        availableBeats: beatsCap(
          state.song.timeSignature.beatsPerMeasure,
          state.song.timeSignature.beatsPerMeasure
        ),
        pendingSection: newSection,
      }

    case "ADD_CHORD_NAME":
      return { ...state, pendingChordName: action.v }

    case "ADD_BEATS":
      return { ...state, pendingBeats: action.v }

    case "ADD_CHORD":
      if (
        state.pendingSection.id === "" ||
        state.pendingChordName === "" ||
        state.pendingBeats === ""
      )
        return state

      const bpm = state.song.timeSignature.beatsPerMeasure
      const beats = Math.max(1, parseInt(state.pendingBeats, 10) || 0)

      const chord: BarChord = {
        id: uuidv4(),
        name: state.pendingChordName,
        duration: beats,
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
        availableBeats,
      }

    case "DELETE_CHORD":
      if (state.pendingSection.id === "") return state
      const barsAfterDelete = state.pendingSection.bars
        .map((bar) => ({
          ...bar,
          chords: bar.chords.filter((chord) => chord.id !== action.v),
        }))
        .filter((bar) => bar.chords.length > 0)
      const lastAfterDelete = barsAfterDelete[barsAfterDelete.length - 1]
      const availableBeatsAfterDelete = lastAfterDelete
        ? beatsCap(
            state.song.timeSignature.beatsPerMeasure,
            remainingBeats(
              lastAfterDelete,
              state.song.timeSignature.beatsPerMeasure
            )
          )
        : state.song.timeSignature.beatsPerMeasure
      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: barsAfterDelete },
        availableBeats: availableBeatsAfterDelete,
        pendingBeats: nextBeatsValue(availableBeatsAfterDelete),
      }

    case "REORDER_CHORDS_IN_BAR":
      const { barId, order } = action
      return {
        ...state,
        pendingSection: {
          ...state.pendingSection,
          bars: state.pendingSection.bars.map((bar) => {
            if (bar.id !== barId) return bar
            const byId = new Map(bar.chords.map((c) => [c.id, c]))
            return {
              ...bar,
              chords: order.map((id) => byId.get(id)!).filter(Boolean),
            }
          }),
        },
      }

    case "CANCEL_SECTION":
      return {
        ...state,
        pendingSection: { id: "", type: "", bars: [] },
        pendingChordName: "",
        pendingBeats: state.song.timeSignature.beatsPerMeasure.toString(),
        availableBeats: state.song.timeSignature.beatsPerMeasure,
      }

    case "FINALIZE_SECTION":
      if (state.pendingSection.id === "" || state.pendingSection.type === "")
        return state

      const sectionToAdd: SongSection = {
        id: state.pendingSection.id,
        type: state.pendingSection.type as SectionType,
        bars: state.pendingSection.bars,
      }

      const bpMueasure = state.song.timeSignature.beatsPerMeasure

      return {
        ...state,
        song: {
          ...state.song,
          songSections: [...state.song.songSections, sectionToAdd],
        },

        pendingSection: { id: "", type: "", bars: [] },
        pendingChordName: "",
        pendingBeats: bpMueasure.toString(),
        availableBeats: bpMueasure,
      }

    case "RESET":
      return {
        ...state,
        song: initialSong,
        pendingSection: { id: "", type: "", bars: [] },
        pendingChordName: "",
        pendingBeats: String(initialSong.timeSignature.beatsPerMeasure),
        availableBeats: initialSong.timeSignature.beatsPerMeasure,
      }

    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.v } }

    case "CLEAR_ERROR":
      const { [action.field]: _, ...rest } = state.errors
      return { ...state, errors: rest }

    default:
      return state
  }
}
