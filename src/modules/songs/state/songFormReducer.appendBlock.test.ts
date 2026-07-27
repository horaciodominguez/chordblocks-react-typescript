import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { PendingSongSection } from "@/modules/songs/types/section.types"

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

const emptySection = {
  id: "sec-1",
  type: "VERSE",
  bars: [],
  repeats: 1,
} satisfies PendingSongSection

describe("ADD_BLOCK append", () => {
  it("creates the first bar on empty section", () => {
    let state = pendingState(emptySection)
    state = reducer(state, { type: "ADD_BLOCK_TEMPORARY", v: "C" })
    state = reducer(state, { type: "ADD_BEATS", v: "4" })
    state = reducer(state, { type: "ADD_BLOCK", newBlockId: "block-1" })

    expect(state.pendingSection.bars).toHaveLength(1)
    expect(state.pendingSection.bars[0].blocks).toHaveLength(1)
    expect(state.pendingSection.bars[0].blocks[0].id).toBe("block-1")
    expect(state.pendingSection.bars[0].blocks[0].chord?.name).toBe("C")
    expect(state.pendingBlock).toBeUndefined()
  })

  it("appends into the last bar when there is room", () => {
    let state = pendingState({
      ...emptySection,
      bars: [
        {
          id: "bar-1",
          position: 1,
          blocks: [
            {
              id: "existing",
              type: "chord",
              duration: 2,
              position: 1,
              chord: { name: "G" },
            },
          ],
        },
      ],
    }, { availableBeats: 2, pendingBeats: "2" })

    state = reducer(state, { type: "ADD_BLOCK_TEMPORARY", v: "Am" })
    state = reducer(state, { type: "ADD_BEATS", v: "2" })
    state = reducer(state, { type: "ADD_BLOCK", newBlockId: "block-2" })

    expect(state.pendingSection.bars).toHaveLength(1)
    expect(state.pendingSection.bars[0].blocks).toHaveLength(2)
    expect(state.pendingSection.bars[0].blocks[1].id).toBe("block-2")
    expect(state.pendingSection.bars[0].blocks[1].chord?.name).toBe("Am")
  })

  it("opens a new bar when the last bar is full", () => {
    let state = pendingState({
      ...emptySection,
      bars: [
        {
          id: "bar-1",
          position: 1,
          blocks: [
            {
              id: "existing",
              type: "chord",
              duration: 4,
              position: 1,
              chord: { name: "G" },
            },
          ],
        },
      ],
    }, { availableBeats: 4, pendingBeats: "4" })

    state = reducer(state, { type: "ADD_BLOCK_TEMPORARY", v: "D" })
    state = reducer(state, { type: "ADD_BEATS", v: "4" })
    state = reducer(state, { type: "ADD_BLOCK", newBlockId: "block-3" })

    expect(state.pendingSection.bars).toHaveLength(2)
    expect(state.pendingSection.bars[1].blocks).toHaveLength(1)
    expect(state.pendingSection.bars[1].blocks[0].id).toBe("block-3")
  })
})

describe("CLEAR_PENDING_BLOCK", () => {
  it("clears a staged draft without changing bars", () => {
    let state = pendingState(emptySection)
    state = reducer(state, { type: "ADD_BLOCK_TEMPORARY", v: "E" })
    expect(state.pendingBlock?.chord?.name).toBe("E")

    const next = reducer(state, { type: "CLEAR_PENDING_BLOCK" })
    expect(next.pendingBlock).toBeUndefined()
    expect(next.pendingSection.bars).toEqual(state.pendingSection.bars)
  })
})
