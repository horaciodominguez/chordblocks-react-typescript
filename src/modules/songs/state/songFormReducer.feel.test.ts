import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { PendingSongSection } from "@/modules/songs/types/section.types"
import { feelToken } from "@/modules/songs/constants/feel"

function pendingState(
  pendingSection: PendingSongSection,
): SongFormState {
  return {
    song: { ...initialSong },
    pendingSection,
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
  }
}

const emptySection = {
  id: "sec-1",
  type: "VERSE",
  bars: [],
  repeats: 1,
} satisfies PendingSongSection

describe("feel blocks", () => {
  it("stages a feel block from feel token", () => {
    const next = reducer(pendingState(emptySection), {
      type: "ADD_BLOCK_TEMPORARY",
      v: feelToken("half-time"),
    })
    expect(next.pendingBlock?.type).toBe("feel")
    expect(next.pendingBlock?.label).toBe("half-time")
  })

  it("rejects invalid feel token", () => {
    const state = pendingState(emptySection)
    const next = reducer(state, {
      type: "ADD_BLOCK_TEMPORARY",
      v: "__FEEL:invalid__",
    })
    expect(next).toBe(state)
  })

  it("keeps feel through finalize", () => {
    const withBar = {
      ...emptySection,
      bars: [
        {
          id: "bar-1",
          position: 1,
          blocks: [],
        },
      ],
    }
    let state = pendingState(withBar)
    state = reducer(state, {
      type: "ADD_BLOCK_TEMPORARY",
      v: feelToken("stop"),
    })
    state = reducer(state, { type: "ADD_BEATS", v: "2" })
    state = reducer(state, { type: "ADD_BLOCK" })
    const finalized = reducer(state, { type: "FINALIZE_SECTION" })
    const block = finalized.song.songSections[0].bars[0].blocks[0]
    expect(block.type).toBe("feel")
    expect(block.label).toBe("stop")
  })
})
