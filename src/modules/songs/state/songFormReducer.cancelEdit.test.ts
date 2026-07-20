import { describe, expect, it } from "vitest"

import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"

const state: SongFormState = {
  song: {
    ...initialSong,
    timeSignature: { beatsPerMeasure: 3, noteValue: 4 },
  },
  pendingSection: {
    id: "section-1",
    type: "VERSE",
    bars: [],
    repeats: 1,
  },
  editingSectionId: "section-1",
  pendingBlock: {
    id: "block-1",
    type: "chord",
    duration: 1,
    position: 1,
    chord: { name: "C" },
  },
  pendingBeats: "1",
  availableBeats: 1,
  errors: {},
}

describe("CANCEL_EDIT_SECTION", () => {
  it("exits edit mode and resets the pending section state", () => {
    const next = reducer(state, { type: "CANCEL_EDIT_SECTION" })

    expect(next.editingSectionId).toBeNull()
    expect(next.pendingSection).toEqual({
      id: "",
      type: "",
      bars: [],
      repeats: 1,
    })
    expect(next.pendingBlock).toBeUndefined()
    expect(next.pendingBeats).toBe("3")
    expect(next.availableBeats).toBe(3)
  })
})
