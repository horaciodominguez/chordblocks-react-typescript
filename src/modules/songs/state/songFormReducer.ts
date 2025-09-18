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
  editingSectionId: string | null
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
  | { type: "REORDER_BARS_IN_SECTION"; sectionId: string; order: string[] }
  | { type: "REORDER_CHORDS_IN_BAR"; barId: string; order: string[] }
  | { type: "CANCEL_SECTION" }
  | { type: "FINALIZE_SECTION" }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; v: Partial<SongFormState["errors"]> }
  | { type: "CLEAR_ERROR"; field: keyof SongFormState["errors"] }
  | { type: "EDIT_SECTION"; v: string }
  | { type: "CANCEL_EDIT_SECTION" }
  | { type: "UPDATE_SECTION" }

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

    case "ADD_SECTION_TYPE": {
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
    }
    case "ADD_CHORD_NAME":
      return { ...state, pendingChordName: action.v }

    case "ADD_BEATS":
      return { ...state, pendingBeats: action.v }

    case "ADD_CHORD": {
      if (
        state.pendingSection.id === "" ||
        state.pendingChordName === "" ||
        state.pendingBeats === ""
      )
        return state

      const bpm = state.song.timeSignature.beatsPerMeasure
      const beats = Math.max(1, parseInt(state.pendingBeats, 10) || 0)

      let bars = [...state.pendingSection.bars]
      const i = bars.length - 1
      const last = bars[i]

      let position = 1
      if (last) {
        const rem = remainingBeats(last, bpm)
        if (beats <= rem) {
          position = last.chords.length + 1
        }
      }

      const chord: BarChord = {
        id: uuidv4(),
        name: state.pendingChordName,
        duration: beats,
        position,
      }

      if (last) {
        const rem = remainingBeats(last, bpm)
        if (beats <= rem) {
          bars[i] = { ...last, chords: [...last.chords, chord] }
        } else {
          bars.push({
            id: uuidv4(),
            chords: [chord],
            position: bars.length + 1,
          })
        }
      } else {
        bars.push({
          id: uuidv4(),
          chords: [chord],
          position: 1,
        })
      }

      bars = bars.filter((bar) => bar.chords.length > 0)

      const lastAfter = bars[bars.length - 1]
      const availableBeats = lastAfter
        ? beatsCap(bpm, remainingBeats(lastAfter, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars },
        pendingChordName: "",
        pendingBeats: nextBeatsValue(availableBeats),
        availableBeats,
      }
    }

    case "DELETE_CHORD": {
      if (state.pendingSection.id === "") return state

      const bpm = state.song.timeSignature.beatsPerMeasure

      let barsAfterDelete = state.pendingSection.bars
        .map((bar) => {
          const chordsAfterDelete = bar.chords
            .filter((chord) => chord.id !== action.v)
            .map((chord, index) => ({
              ...chord,
              position: index + 1,
            }))

          return { ...bar, chords: chordsAfterDelete }
        })
        .filter((bar) => bar.chords.length > 0)

      barsAfterDelete = barsAfterDelete.map((bar, index) => ({
        ...bar,
        position: index + 1,
      }))

      const lastAfterDelete = barsAfterDelete[barsAfterDelete.length - 1]

      const availableBeats = lastAfterDelete
        ? beatsCap(bpm, remainingBeats(lastAfterDelete, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: barsAfterDelete },
        availableBeats,
        pendingBeats: nextBeatsValue(availableBeats),
      }
    }

    case "REORDER_BARS_IN_SECTION": {
      const { order } = action

      const section = state.pendingSection
      if (!section) return state

      const barsReordered = order
        .map((id) => section.bars.find((bar) => bar.id === id)!)
        .filter(Boolean)
        .map((bar, index) => ({
          ...bar,
          position: index + 1,
        }))

      const pendingSection = {
        ...state.pendingSection,
        bars: barsReordered,
      }

      return {
        ...state,
        pendingSection,
      }
    }

    case "REORDER_CHORDS_IN_BAR": {
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
              chords: order
                .map((id, index) => {
                  const chord = byId.get(id)
                  return chord ? { ...chord, position: index + 1 } : null
                })
                .filter(Boolean) as typeof bar.chords,
            }
          }),
        },
      }
    }

    case "CANCEL_SECTION": {
      return {
        ...state,
        pendingSection: { id: "", type: "", bars: [] },
        pendingChordName: "",
        pendingBeats: state.song.timeSignature.beatsPerMeasure.toString(),
        availableBeats: state.song.timeSignature.beatsPerMeasure,
      }
    }
    case "FINALIZE_SECTION": {
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

    case "CLEAR_ERROR": {
      const { [action.field]: _, ...rest } = state.errors
      return { ...state, errors: rest }
    }

    case "EDIT_SECTION": {
      const sectionToEdit = state.song.songSections.find(
        (s) => s.id === action.v
      )
      return {
        ...state,
        pendingSection: sectionToEdit
          ? { ...sectionToEdit }
          : { id: "", type: "", bars: [] },
        editingSectionId: action.v,
      }
    }
    case "CANCEL_EDIT_SECTION": {
      return {
        ...state,
        editingSectionId: null,
        pendingSection: { id: "", type: "", bars: [] },
      }
    }
    case "UPDATE_SECTION": {
      if (state.editingSectionId === null || !state.pendingSection) return state

      return {
        ...state,
        song: {
          ...state.song,
          songSections: state.song.songSections.map((s) =>
            s.id === state.editingSectionId
              ? { ...(state.pendingSection as SongSection) }
              : s
          ),
        },
        editingSectionId: null,
        pendingSection: { id: "", type: "", bars: [] },
      }
    }
    default:
      return state
  }
}
