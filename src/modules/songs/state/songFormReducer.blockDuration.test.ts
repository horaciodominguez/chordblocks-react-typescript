import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type {
  PendingSongSection,
  SongSection,
} from "@/modules/songs/types/section.types"

function pendingState(
  pendingSection: PendingSongSection,
  overrides: Partial<SongFormState> = {},
): SongFormState {
  return {
    song: { ...initialSong },
    pendingSection,
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
    ...overrides,
  }
}

const sectionWithPartialBar = {
  id: "sec-1",
  type: "VERSE",
  bars: [
    {
      id: "bar-1",
      position: 1,
      blocks: [
        {
          id: "b1",
          type: "chord",
          duration: 2,
          position: 1,
          chord: { name: "Am" },
        },
        {
          id: "b2",
          type: "chord",
          duration: 1,
          position: 2,
          chord: { name: "G" },
        },
      ],
    },
  ],
  repeats: 1,
} satisfies PendingSongSection & SongSection

describe("UPDATE_BLOCK_DURATION", () => {
  it("increases block duration when space is available in the bar", () => {
    const state = pendingState(sectionWithPartialBar)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_DURATION",
      blockId: "b1",
      duration: 3,
    })

    expect(next.pendingSection.bars[0].blocks[0].duration).toBe(3)
    expect(next.availableBeats).toBe(4)
    expect(next.pendingBeats).toBe("4")
  })

  it("decreases block duration and frees beats for new blocks", () => {
    const state = pendingState(sectionWithPartialBar)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_DURATION",
      blockId: "b1",
      duration: 1,
    })

    expect(next.pendingSection.bars[0].blocks[0].duration).toBe(1)
    expect(next.availableBeats).toBe(2)
    expect(next.pendingBeats).toBe("2")
  })

  it("rejects duration that exceeds bar capacity", () => {
    const state = pendingState(sectionWithPartialBar)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_DURATION",
      blockId: "b2",
      duration: 4,
    })

    expect(next).toBe(state)
  })
})

describe("EDIT_SECTION", () => {
  it("recalculates availableBeats from the last bar", () => {
    const state: SongFormState = {
      song: {
        ...initialSong,
        songSections: [sectionWithPartialBar],
      },
      pendingSection: { id: "", type: "", bars: [], repeats: 1 },
      editingSectionId: null,
      pendingBeats: "4",
      availableBeats: 4,
      errors: {},
    }

    const next = reducer(state, { type: "EDIT_SECTION", v: "sec-1" })

    expect(next.availableBeats).toBe(1)
    expect(next.pendingBeats).toBe("1")
    expect(next.pendingBlock).toBeUndefined()
  })
})
