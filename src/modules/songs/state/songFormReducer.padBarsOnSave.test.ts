import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { PendingSongSection } from "@/modules/songs/types/section.types"

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

describe("FINALIZE_SECTION pads incomplete bars", () => {
  it("adds rests so a short bar fills 4/4", () => {
    const state = pendingState({
      id: "sec-1",
      type: "VERSE",
      repeats: 1,
      bars: [
        {
          id: "bar-1",
          position: 1,
          blocks: [
            {
              id: "c1",
              type: "chord",
              duration: 1,
              position: 1,
              chord: { name: "C" },
            },
          ],
        },
      ],
    })

    const next = reducer(state, { type: "FINALIZE_SECTION" })
    const blocks = next.song.songSections[0].bars[0].blocks
    expect(blocks).toHaveLength(2)
    expect(blocks[0].chord?.name).toBe("C")
    expect(blocks[1].type).toBe("rest")
    expect(blocks[1].duration).toBe(3)
  })

  it("pads after shrunk blocks on UPDATE_SECTION", () => {
    const sectionId = "sec-edit"
    let state: SongFormState = {
      song: {
        ...initialSong,
        songSections: [
          {
            id: sectionId,
            type: "VERSE",
            repeats: 1,
            bars: [
              {
                id: "bar-1",
                position: 1,
                blocks: [
                  {
                    id: "a",
                    type: "chord",
                    duration: 2,
                    position: 1,
                    chord: { name: "G" },
                  },
                  {
                    id: "b",
                    type: "chord",
                    duration: 2,
                    position: 2,
                    chord: { name: "D" },
                  },
                ],
              },
            ],
          },
        ],
      },
      pendingSection: {
        id: sectionId,
        type: "VERSE",
        repeats: 1,
        bars: [
          {
            id: "bar-1",
            position: 1,
            blocks: [
              {
                id: "a",
                type: "chord",
                duration: 2,
                position: 1,
                chord: { name: "G" },
              },
              {
                id: "b",
                type: "chord",
                duration: 1,
                position: 2,
                chord: { name: "D" },
              },
            ],
          },
        ],
      },
      editingSectionId: sectionId,
      pendingBeats: "1",
      availableBeats: 1,
      errors: {},
    }

    state = reducer(state, { type: "UPDATE_SECTION" })
    const blocks = state.song.songSections[0].bars[0].blocks
    expect(blocks.map((b) => b.duration)).toEqual([2, 1, 1])
    expect(blocks[2].type).toBe("rest")
  })
})
