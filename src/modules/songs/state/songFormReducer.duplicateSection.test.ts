import { describe, expect, it } from "vitest"

import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { SongSection } from "@/modules/songs/types/section.types"

const section: SongSection = {
  id: "section-a",
  type: "CHORUS",
  label: "A",
  repeats: 2,
  bars: [
    {
      id: "bar-a",
      position: 1,
      blocks: [
        {
          id: "chord-a",
          type: "chord",
          duration: 2,
          position: 1,
          chord: { name: "C" },
        },
        { id: "rest-a", type: "rest", duration: 1, position: 2 },
        {
          id: "riff-a",
          type: "riff",
          label: "Riff 1",
          duration: 1,
          position: 3,
        },
        { id: "solo-a", type: "solo", duration: 4, position: 4 },
      ],
    },
  ],
}

function baseState(sections: SongSection[]): SongFormState {
  return {
    song: {
      ...initialSong,
      updatedAt: "2025-01-01T00:00:00.000Z",
      songSections: sections,
    },
    pendingSection: { id: "", type: "", bars: [], repeats: 1 },
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
  }
}

function withoutIds(source: SongSection): Omit<SongSection, "id"> {
  const copy = structuredClone(source)
  Reflect.deleteProperty(copy, "id")

  copy.bars.forEach((bar) => {
    Reflect.deleteProperty(bar, "id")
    bar.blocks.forEach((block) => Reflect.deleteProperty(block, "id"))
  })

  return copy
}

describe("DUPLICATE_SECTION", () => {
  it("appends an exact deep copy with fresh nested IDs", () => {
    const source = structuredClone(section)
    const state = baseState([
      { ...source, id: "section-a" },
      { ...source, id: "section-b", type: "VERSE" },
    ])

    const next = reducer(state, { type: "DUPLICATE_SECTION", v: "section-a" })
    const duplicate = next.song.songSections.at(-1)!

    expect(next.song.songSections).toHaveLength(3)
    expect(withoutIds(duplicate)).toEqual(withoutIds(source))
    expect(duplicate.id).not.toBe(source.id)
    expect(duplicate.bars[0].id).not.toBe(source.bars[0].id)
    expect(duplicate.bars[0].blocks.map((block) => block.id)).not.toEqual(
      source.bars[0].blocks.map((block) => block.id)
    )
    expect(duplicate.bars[0].blocks[0].chord).not.toBe(
      source.bars[0].blocks[0].chord
    )
    expect(next.duplicatedSectionId).toBe(duplicate.id)
    expect(next.song.updatedAt).not.toBe(state.song.updatedAt)
    expect(state.song.songSections).toHaveLength(2)
  })

  it("ignores an unknown section ID", () => {
    const state = baseState([section])

    expect(reducer(state, { type: "DUPLICATE_SECTION", v: "unknown" })).toBe(
      state
    )
  })

  it("clears the transient duplicated-section indicator", () => {
    const state = { ...baseState([section]), duplicatedSectionId: "duplicate" }

    expect(reducer(state, { type: "CLEAR_DUPLICATED_SECTION" }))
      .not.toHaveProperty("duplicatedSectionId")
  })
})
