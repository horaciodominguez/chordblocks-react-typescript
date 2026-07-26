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

describe("UPDATE_BLOCK_VOICING", () => {
  const section: PendingSongSection = {
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
            duration: 4,
            position: 1,
            chord: { name: "C" },
          },
        ],
      },
    ],
    repeats: 1,
  }

  it("stores alternate voicing on a chord block", () => {
    const next = reducer(pendingState(section), {
      type: "UPDATE_BLOCK_VOICING",
      blockId: "b1",
      voicing: 1,
    })
    expect(next.pendingSection.bars[0].blocks[0].chord).toEqual({
      name: "C",
      voicing: 1,
    })
  })

  it("omits voicing field when cycling back to primary", () => {
    const withAlt = reducer(pendingState(section), {
      type: "UPDATE_BLOCK_VOICING",
      blockId: "b1",
      voicing: 2,
    })
    const next = reducer(withAlt, {
      type: "UPDATE_BLOCK_VOICING",
      blockId: "b1",
      voicing: 0,
    })
    expect(next.pendingSection.bars[0].blocks[0].chord).toEqual({ name: "C" })
  })

  it("keeps voicing when picking a temporary chord", () => {
    const next = reducer(pendingState(section), {
      type: "ADD_BLOCK_TEMPORARY",
      v: "G",
      voicing: 1,
    })
    expect(next.pendingBlock?.chord).toEqual({ name: "G", voicing: 1 })
  })
})
