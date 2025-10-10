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

import type { Block } from "@/modules/songs/types/block.types"

export type SongFormState = {
  song: SongType
  pendingSection: PendingSongSection
  editingSectionId: string | null
  pendingBlock?: Block
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
  | { type: "ADD_BLOCK_TEMPORARY"; v: string }
  | { type: "ADD_REST" }
  | { type: "ADD_BEATS"; v: string }
  | { type: "ADD_BLOCK" }
  | { type: "DELETE_BLOCK"; v: string }
  | { type: "REORDER_BARS_IN_SECTION"; sectionId: string; order: string[] }
  | { type: "REORDER_BLOCKS"; barId: string; order: string[] }
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
    case "ADD_BLOCK_TEMPORARY": {
      // token usado por el picker para representar un rest
      const REST_TOKEN = "__REST__"
      const isRest = action.v === REST_TOKEN

      if (isRest) {
        // pendingBlock para un rest (duración/position/ id serán reemplazados en ADD_BLOCK)
        return {
          ...state,
          pendingBlock: {
            id: uuidv4(),
            type: "rest",
            duration: 0,
            position: 0,
          } as Block,
        }
      }

      // para los chords, tomamos el nombre (si viene con variaciones separadas por ':', sacamos la parte antes de ':')
      const chordName = action.v.includes(":")
        ? action.v.split(":")[0]
        : action.v

      return {
        ...state,
        pendingBlock: {
          id: uuidv4(),
          type: "chord",
          duration: 0,
          position: 0,
          chord: { name: chordName },
        } as Block,
      }
    }

    case "ADD_BEATS":
      return { ...state, pendingBeats: action.v }

    case "ADD_BLOCK": {
      if (
        state.pendingSection.id === "" ||
        state.pendingBeats === "" ||
        !state.pendingBlock
      )
        return state

      const bpm = state.song.timeSignature.beatsPerMeasure
      const beats = Math.max(1, parseInt(state.pendingBeats, 10) || 0)
      const bars = [...state.pendingSection.bars]
      const i = bars.length - 1
      const lastBar = bars[i]

      let position = 1
      if (lastBar) {
        const rem = remainingBeats(lastBar, bpm)
        if (beats <= rem) position = lastBar.blocks.length + 1
      }

      const newBlock: Block = {
        ...state.pendingBlock,
        id: uuidv4(),
        duration: beats,
        position,
      }

      if (lastBar) {
        const rem = remainingBeats(lastBar, bpm)
        if (beats <= rem) {
          bars[i] = { ...lastBar, blocks: [...lastBar.blocks, newBlock] }
        } else {
          bars.push({
            id: uuidv4(),
            blocks: [newBlock],
            position: bars.length + 1,
          })
        }
      } else {
        bars.push({
          id: uuidv4(),
          blocks: [newBlock],
          position: 1,
        })
      }

      const filteredBars = bars.filter((bar) => bar.blocks.length > 0)
      const lastAfter = filteredBars[filteredBars.length - 1]
      const availableBeats = lastAfter
        ? beatsCap(bpm, remainingBeats(lastAfter, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: filteredBars },
        pendingBlock: undefined,
        availableBeats,
        pendingBeats: nextBeatsValue(availableBeats),
      }
    }

    case "DELETE_BLOCK": {
      if (state.pendingSection.id === "") return state

      const bpm = state.song.timeSignature.beatsPerMeasure

      let updatedBars = state.pendingSection.bars
        .map((bar) => {
          const remainingBlocks = bar.blocks
            .filter((block) => block.id !== action.v)
            .map((block, index) => ({
              ...block,
              position: index + 1,
            }))
          return { ...bar, blocks: remainingBlocks }
        })
        .filter((bar) => bar.blocks.length > 0)

      updatedBars = updatedBars.map((bar, index) => ({
        ...bar,
        position: index + 1,
      }))

      const lastAfterDelete = updatedBars[updatedBars.length - 1]
      const availableBeats = lastAfterDelete
        ? beatsCap(bpm, remainingBeats(lastAfterDelete, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: updatedBars },
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

    case "REORDER_BLOCKS": {
      const { barId, order } = action
      return {
        ...state,
        pendingSection: {
          ...state.pendingSection,
          bars: state.pendingSection.bars.map((bar) => {
            if (bar.id !== barId) return bar
            const byId = new Map(bar.blocks.map((c) => [c.id, c]))
            return {
              ...bar,
              blocks: order
                .map((id, index) => {
                  const block = byId.get(id)
                  return block ? { ...block, position: index + 1 } : null
                })
                .filter(Boolean) as typeof bar.blocks,
            }
          }),
        },
      }
    }

    case "CANCEL_SECTION": {
      return {
        ...state,
        pendingSection: { id: "", type: "", bars: [] },
        //pendingChordName: "",
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
        bars: state.pendingSection.bars.map((bar) => ({
          ...bar,
          // Aseguramos clonado profundo para no perder los chords
          blocks: bar.blocks.map((block) => ({
            ...block,
            ...(block.type === "chord" && block.chord
              ? { chord: { ...block.chord } }
              : {}),
          })),
        })),
      }

      const bpm = state.song.timeSignature.beatsPerMeasure

      return {
        ...state,
        song: {
          ...state.song,
          // ✅ acá está el fix: usar spread correcto
          songSections: [...state.song.songSections, sectionToAdd],
          updatedAt: new Date().toISOString(),
        },
        pendingSection: { id: "", type: "", bars: [] },
        pendingBeats: bpm.toString(),
        availableBeats: bpm,
      }
    }

    case "RESET":
      return {
        ...state,
        song: initialSong,
        pendingSection: { id: "", type: "", bars: [] },
        //pendingChordName: "",
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
