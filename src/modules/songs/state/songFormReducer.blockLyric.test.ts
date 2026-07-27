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

const sectionWithBlocks = {
  id: "sec-1",
  type: "VERSE",
  bars: [
    {
      id: "bar-1",
      position: 1,
      blocks: [
        {
          id: "chord-1",
          type: "chord",
          duration: 2,
          position: 1,
          chord: { name: "C" },
        },
        {
          id: "rest-1",
          type: "rest",
          duration: 1,
          position: 2,
          lyric: "old",
        },
        {
          id: "riff-1",
          type: "riff",
          duration: 1,
          position: 3,
        },
      ],
    },
  ],
  repeats: 1,
} satisfies PendingSongSection & SongSection

describe("UPDATE_BLOCK_LYRIC", () => {
  it("sets lyric on a chord block", () => {
    const next = reducer(pendingState(sectionWithBlocks), {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "chord-1",
      lyric: "Hello",
    })
    expect(next.pendingSection.bars[0].blocks[0].lyric).toBe("Hello")
  })

  it("trims and clears empty lyric", () => {
    const withLyric = reducer(pendingState(sectionWithBlocks), {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "chord-1",
      lyric: "  Hi  ",
    })
    expect(withLyric.pendingSection.bars[0].blocks[0].lyric).toBe("Hi")

    const cleared = reducer(withLyric, {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "chord-1",
      lyric: undefined,
    })
    expect(cleared.pendingSection.bars[0].blocks[0]).not.toHaveProperty(
      "lyric",
    )

    const blank = reducer(withLyric, {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "rest-1",
      lyric: "   ",
    })
    expect(blank.pendingSection.bars[0].blocks[1]).not.toHaveProperty("lyric")
  })

  it("rejects lyrics longer than 80 characters", () => {
    const state = pendingState(sectionWithBlocks)
    const next = reducer(state, {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "chord-1",
      lyric: "x".repeat(81),
    })
    expect(next).toBe(state)
  })

  it("keeps lyric through FINALIZE_SECTION", () => {
    const withLyric = reducer(pendingState(sectionWithBlocks), {
      type: "UPDATE_BLOCK_LYRIC",
      blockId: "chord-1",
      lyric: "darkness",
    })
    const finalized = reducer(withLyric, { type: "FINALIZE_SECTION" })
    expect(finalized.song.songSections[0].bars[0].blocks[0].lyric).toBe(
      "darkness",
    )
    expect(finalized.song.songSections[0].bars[0].blocks[1].lyric).toBe("old")
  })
})
