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

const sectionWithMarkers = {
  id: "sec-1",
  type: "VERSE",
  bars: [
    {
      id: "bar-1",
      position: 1,
      blocks: [
        {
          id: "riff-1",
          type: "riff",
          label: "Riff 1",
          duration: 2,
          position: 1,
        },
        {
          id: "solo-1",
          type: "solo",
          duration: 1,
          position: 2,
          refTime: 90,
        },
        {
          id: "chord-1",
          type: "chord",
          duration: 1,
          position: 3,
          chord: { name: "Am" },
        },
      ],
    },
  ],
  repeats: 1,
} satisfies PendingSongSection & SongSection

describe("UPDATE_BLOCK_REF_TIME", () => {
  it("sets the reference time on a riff block", () => {
    const state = pendingState(sectionWithMarkers)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "riff-1",
      refTime: 45,
    })

    expect(next.pendingSection.bars[0].blocks[0].refTime).toBe(45)
  })

  it("updates an existing reference time on a solo block", () => {
    const state = pendingState(sectionWithMarkers)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "solo-1",
      refTime: 120,
    })

    expect(next.pendingSection.bars[0].blocks[1].refTime).toBe(120)
  })

  it("removes the reference time when refTime is undefined", () => {
    const state = pendingState(sectionWithMarkers)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "solo-1",
      refTime: undefined,
    })

    expect(next.pendingSection.bars[0].blocks[1]).not.toHaveProperty("refTime")
  })

  it("ignores chord blocks", () => {
    const state = pendingState(sectionWithMarkers)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "chord-1",
      refTime: 10,
    })

    expect(next).toBe(state)
  })

  it("rejects negative or non-integer times", () => {
    const state = pendingState(sectionWithMarkers)

    expect(
      reducer(state, {
        type: "UPDATE_BLOCK_REF_TIME",
        blockId: "riff-1",
        refTime: -5,
      }),
    ).toBe(state)

    expect(
      reducer(state, {
        type: "UPDATE_BLOCK_REF_TIME",
        blockId: "riff-1",
        refTime: 1.5,
      }),
    ).toBe(state)
  })

  it("returns the same state when the block does not exist", () => {
    const state = pendingState(sectionWithMarkers)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "missing",
      refTime: 10,
    })

    expect(next).toBe(state)
  })

  it("keeps refTime through FINALIZE_SECTION", () => {
    const state = pendingState(sectionWithMarkers)
    const withTime = reducer(state, {
      type: "UPDATE_BLOCK_REF_TIME",
      blockId: "riff-1",
      refTime: 45,
    })
    const finalized = reducer(withTime, { type: "FINALIZE_SECTION" })

    const saved = finalized.song.songSections[0]
    expect(saved.bars[0].blocks[0].refTime).toBe(45)
    expect(saved.bars[0].blocks[1].refTime).toBe(90)
  })
})

describe("SET_YOUTUBE_URL", () => {
  it("sets and clears the song's YouTube URL", () => {
    const state = pendingState({ id: "", type: "", bars: [], repeats: 1 })

    const withUrl = reducer(state, {
      type: "SET_YOUTUBE_URL",
      v: "https://youtu.be/1k8craCGpgs",
    })
    expect(withUrl.song.youtubeUrl).toBe("https://youtu.be/1k8craCGpgs")

    const cleared = reducer(withUrl, { type: "SET_YOUTUBE_URL", v: undefined })
    expect(cleared.song).not.toHaveProperty("youtubeUrl")
  })
})
