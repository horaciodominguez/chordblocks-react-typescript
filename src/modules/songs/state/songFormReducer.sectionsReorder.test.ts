import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { SongSection } from "@/modules/songs/types/section.types"

function section(id: string, type: SongSection["type"]): SongSection {
  return {
    id,
    type,
    bars: [
      {
        id: `${id}-bar`,
        position: 1,
        blocks: [
          {
            id: `${id}-block`,
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
}

function baseState(sections: SongSection[]): SongFormState {
  return {
    song: { ...initialSong, songSections: sections },
    pendingSection: { id: "", type: "", bars: [], repeats: 1 },
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
  }
}

describe("REORDER_SECTIONS", () => {
  it("reorders song sections by id list", () => {
    const sections = [
      section("sec-1", "INTRO"),
      section("sec-2", "VERSE"),
      section("sec-3", "CHORUS"),
    ]
    const state = baseState(sections)
    const next = reducer(state, {
      type: "REORDER_SECTIONS",
      order: ["sec-3", "sec-1", "sec-2"],
    })

    expect(next.song.songSections.map((s) => s.id)).toEqual([
      "sec-3",
      "sec-1",
      "sec-2",
    ])
    expect(next.song.updatedAt).not.toBe(state.song.updatedAt)
  })

  it("ignores invalid order lists", () => {
    const sections = [section("sec-1", "INTRO"), section("sec-2", "VERSE")]
    const state = baseState(sections)
    const next = reducer(state, {
      type: "REORDER_SECTIONS",
      order: ["sec-2"],
    })

    expect(next).toBe(state)
  })
})
