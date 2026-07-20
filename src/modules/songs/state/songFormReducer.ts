import { v4 as uuidv4 } from "uuid"

import type {
  Song as SongType,
  TimeSignature,
} from "@/modules/songs/types/song.types"

import { beatsCap, nextBeatsValue, remainingBeats } from "../utils/beats"
import type {
  PendingSongSection,
  SectionType,
  SongSection,
} from "../types/section.types"

import type { Block } from "@/modules/songs/types/block.types"
import {
  bakeTranspose,
  transposeChordName,
} from "@/modules/chords/utils/transpose"
import { parseChordName } from "@/modules/chords/utils/chord.utils"

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
  | { type: "SET_GENRE"; v: string }
  | { type: "SET_YEAR"; v: number }
  | { type: "SET_MAIN_KEY"; v: string | undefined }
  | { type: "SET_TIME_SIGNATURE"; v: TimeSignature }
  | { type: "SET_IMAGE_BASE64"; v: string | null }
  | { type: "ADD_SECTION_TYPE"; v: SectionType }
  | { type: "ADD_BLOCK_TEMPORARY"; v: string }
  | { type: "ADD_REST" }
  | { type: "ADD_BEATS"; v: string }
  | { type: "ADD_BLOCK" }
  | { type: "DELETE_BLOCK"; v: string }
  | { type: "UPDATE_BLOCK_DURATION"; blockId: string; duration: number }
  | { type: "REORDER_BARS_IN_SECTION"; sectionId: string; order: string[] }
  | { type: "REORDER_BLOCKS"; barId: string; order: string[] }
  | { type: "REORDER_SECTIONS"; order: string[] }
  | { type: "SET_PENDING_SECTION_REPEATS"; v: number }
  | { type: "SET_PENDING_SECTION_LABEL"; v: string | undefined }
  | { type: "CANCEL_SECTION" }
  | { type: "FINALIZE_SECTION" }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; v: Partial<SongFormState["errors"]> }
  | { type: "CLEAR_ERROR"; field: keyof SongFormState["errors"] }
  | { type: "EDIT_SECTION"; v: string }
  | { type: "CANCEL_EDIT_SECTION" }
  | { type: "UPDATE_SECTION" }
  | { type: "DELETE_SECTION"; v: string }
  | { type: "BAKE_TRANSPOSE"; v: number }

export const initialSong: SongType = {
  id: uuidv4(),
  title: "",
  artist: "",
  genre: "",
  year: new Date().getFullYear(),
  timeSignature: {
    beatsPerMeasure: 4,
    noteValue: 4,
  },
  imageUrl: null,
  imageBase64: null,
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

    case "SET_GENRE":
      return { ...state, song: { ...state.song, genre: action.v } }

    case "SET_YEAR":
      return { ...state, song: { ...state.song, year: action.v } }

    case "SET_MAIN_KEY": {
      const { mainKey: _, ...rest } = state.song
      return {
        ...state,
        song: action.v
          ? { ...state.song, mainKey: action.v }
          : { ...rest },
      }
    }

    case "SET_TIME_SIGNATURE":
      return {
        ...state,
        song: {
          ...state.song,
          timeSignature: { ...state.song.timeSignature, ...action.v },
        },
      }

    case "SET_IMAGE_BASE64":
      return {
        ...state,
        song: { ...state.song, imageBase64: action.v },
      }

    case "ADD_SECTION_TYPE": {
      if (state.pendingSection.id !== "") {
        return {
          ...state,
          pendingSection: {
            ...state.pendingSection,
            type: action.v,
          },
        }
      }

      const newSection: PendingSongSection = {
        id: uuidv4(),
        type: action.v,
        bars: [],
        repeats: 1,
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
      const REST_TOKEN = "__REST__"
      const SOLO_TOKEN = "__SOLO__"
      const RIFF_PREFIX = "__RIFF:"

      if (action.v === REST_TOKEN) {
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

      if (action.v === SOLO_TOKEN) {
        return {
          ...state,
          pendingBlock: {
            id: uuidv4(),
            type: "solo",
            duration: 0,
            position: 0,
          } as Block,
        }
      }

      if (action.v.startsWith(RIFF_PREFIX) && action.v.endsWith("__")) {
        const inner = action.v.slice(RIFF_PREFIX.length, -2).trim()
        return {
          ...state,
          pendingBlock: {
            id: uuidv4(),
            type: "riff",
            duration: 0,
            position: 0,
            ...(inner ? { label: inner } : {}),
          } as Block,
        }
      }

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

    case "UPDATE_BLOCK_DURATION": {
      if (state.pendingSection.id === "") return state

      const bpm = state.song.timeSignature.beatsPerMeasure
      const { blockId, duration } = action
      if (duration < 1 || duration > 12) return state

      let found = false
      const updatedBars = state.pendingSection.bars.map((bar) => {
        const blockIndex = bar.blocks.findIndex((b) => b.id === blockId)
        if (blockIndex === -1) return bar

        const block = bar.blocks[blockIndex]
        const maxDuration = block.duration + remainingBeats(bar, bpm)
        if (duration > maxDuration) return bar

        found = true
        const blocks = [...bar.blocks]
        blocks[blockIndex] = { ...block, duration }
        return { ...bar, blocks }
      })

      if (!found) return state

      const lastBar = updatedBars[updatedBars.length - 1]
      const availableBeats = lastBar
        ? beatsCap(bpm, remainingBeats(lastBar, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: { ...state.pendingSection, bars: updatedBars },
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

    case "REORDER_SECTIONS": {
      const { order } = action
      const byId = new Map(state.song.songSections.map((s) => [s.id, s]))
      const reordered = order
        .map((id) => byId.get(id))
        .filter(Boolean) as SongSection[]

      if (reordered.length !== state.song.songSections.length) return state

      return {
        ...state,
        song: {
          ...state.song,
          songSections: reordered,
          updatedAt: new Date().toISOString(),
        },
      }
    }

    case "SET_PENDING_SECTION_REPEATS": {
      const repeats = Math.max(1, Number(action.v || 1))
      return {
        ...state,
        pendingSection: {
          ...state.pendingSection,
          repeats,
        },
      }
    }

    case "SET_PENDING_SECTION_LABEL": {
      const { label: _, ...rest } = state.pendingSection
      return {
        ...state,
        pendingSection: action.v
          ? { ...state.pendingSection, label: action.v }
          : { ...rest },
      }
    }

    case "CANCEL_SECTION": {
      return {
        ...state,
        pendingSection: { id: "", type: "", bars: [], repeats: 1 },
        pendingBlock: undefined,
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

          blocks: bar.blocks.map((block) => ({
            ...block,
            ...(block.type === "chord" && block.chord
              ? { chord: { ...block.chord } }
              : {}),
            ...(block.type === "riff" && block.label?.trim()
              ? { label: block.label.trim() }
              : {}),
          })),
        })),
        repeats: state.pendingSection.repeats,
        ...(state.pendingSection.label?.trim()
          ? { label: state.pendingSection.label.trim() }
          : {}),
      }

      const bpm = state.song.timeSignature.beatsPerMeasure

      return {
        ...state,
        song: {
          ...state.song,

          songSections: [...state.song.songSections, sectionToAdd],
          updatedAt: new Date().toISOString(),
        },
        pendingSection: { id: "", type: "", bars: [], repeats: 1 },
        pendingBeats: bpm.toString(),
        availableBeats: bpm,
      }
    }

    case "RESET": {
      const bpm = initialSong.timeSignature.beatsPerMeasure
      const freshSong: SongType = {
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
      delete freshSong.mainKey
      return {
        ...state,
        song: freshSong,
        pendingSection: { id: "", type: "", bars: [], repeats: 1 },
        pendingBlock: undefined,
        pendingBeats: String(bpm),
        availableBeats: bpm,
        editingSectionId: null,
        errors: {},
      }
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
      const bpm = state.song.timeSignature.beatsPerMeasure
      const bars = sectionToEdit?.bars ?? []
      const lastBar = bars[bars.length - 1]
      const availableBeats = lastBar
        ? beatsCap(bpm, remainingBeats(lastBar, bpm))
        : beatsCap(bpm, bpm)

      return {
        ...state,
        pendingSection: sectionToEdit
          ? { ...sectionToEdit }
          : { id: "", type: "", bars: [], repeats: 1 },
        editingSectionId: action.v,
        availableBeats,
        pendingBeats: nextBeatsValue(availableBeats),
        pendingBlock: undefined,
      }
    }
    case "CANCEL_EDIT_SECTION": {
      return {
        ...state,
        editingSectionId: null,
        pendingSection: { id: "", type: "", bars: [], repeats: 1 },
      }
    }
    case "UPDATE_SECTION": {
      if (
        state.editingSectionId === null ||
        !state.pendingSection ||
        state.pendingSection.type === ""
      )
        return state

      const label = state.pendingSection.label?.trim()
      const updated: SongSection = {
        id: state.pendingSection.id,
        type: state.pendingSection.type,
        bars: state.pendingSection.bars,
        repeats: state.pendingSection.repeats,
        ...(label ? { label } : {}),
      }

      return {
        ...state,
        song: {
          ...state.song,
          songSections: state.song.songSections.map((s) =>
            s.id === state.editingSectionId ? updated : s
          ),
          updatedAt: new Date().toISOString(),
        },
        editingSectionId: null,
        pendingSection: { id: "", type: "", bars: [], repeats: 1 },
      }
    }

    case "DELETE_SECTION": {
      const bpm = state.song.timeSignature.beatsPerMeasure
      const deletingCurrent =
        state.editingSectionId === action.v ||
        state.pendingSection.id === action.v

      return {
        ...state,
        song: {
          ...state.song,
          songSections: state.song.songSections.filter((s) => s.id !== action.v),
          updatedAt: new Date().toISOString(),
        },
        ...(deletingCurrent
          ? {
              editingSectionId: null,
              pendingSection: { id: "", type: "", bars: [], repeats: 1 },
              pendingBlock: undefined,
              pendingBeats: String(bpm),
              availableBeats: bpm,
            }
          : {}),
      }
    }

    case "BAKE_TRANSPOSE": {
      const semitones = action.v
      if (!semitones) return state

      const song = {
        ...bakeTranspose(state.song, semitones),
        updatedAt: new Date().toISOString(),
      }

      let pendingSection = state.pendingSection
      if (pendingSection.bars.length > 0) {
        const stubType = (pendingSection.type || "OTHER") as SectionType
        const projected = bakeTranspose(
          {
            ...state.song,
            songSections: [
              {
                id: pendingSection.id || "pending",
                type: stubType,
                bars: pendingSection.bars,
                repeats: pendingSection.repeats,
                ...(pendingSection.label
                  ? { label: pendingSection.label }
                  : {}),
              },
            ],
          },
          semitones,
        )
        pendingSection = {
          ...pendingSection,
          bars: projected.songSections[0].bars,
        }
      }

      let pendingBlock = state.pendingBlock
      if (pendingBlock?.type === "chord" && pendingBlock.chord?.name) {
        const newName = transposeChordName(
          pendingBlock.chord.name,
          semitones,
        )
        const parsed = parseChordName(newName)
        pendingBlock = {
          ...pendingBlock,
          chord: {
            ...pendingBlock.chord,
            name: newName,
            ...(parsed?.root != null ? { root: parsed.root } : {}),
            ...(parsed?.suffix != null ? { suffix: parsed.suffix } : {}),
            ...(parsed?.type != null ? { type: parsed.type } : {}),
          },
        }
      }

      return {
        ...state,
        song,
        pendingSection,
        pendingBlock,
      }
    }

    default:
      return state
  }
}
