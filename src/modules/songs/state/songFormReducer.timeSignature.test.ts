import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { PendingSongSection } from "@/modules/songs/types/section.types"

function baseState(
  overrides: Partial<SongFormState> = {},
): SongFormState {
  return {
    song: {
      ...initialSong,
      title: "T",
      artist: "A",
      genre: "G",
      songSections: [
        {
          id: "sec-default",
          type: "VERSE",
          repeats: 1,
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
        },
        {
          id: "sec-override",
          type: "CHORUS",
          repeats: 1,
          timeSignature: { beatsPerMeasure: 3, noteValue: 4 },
          bars: [
            {
              id: "bar-2",
              position: 1,
              blocks: [
                {
                  id: "b2",
                  type: "chord",
                  duration: 3,
                  position: 1,
                  chord: { name: "G" },
                },
              ],
            },
          ],
        },
      ],
    },
    pendingSection: { id: "", type: "", bars: [], repeats: 1 },
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
    ...overrides,
  }
}

describe("SET_TIME_SIGNATURE", () => {
  it("repacks sections without override when beats change", () => {
    const next = reducer(baseState(), {
      type: "SET_TIME_SIGNATURE",
      v: { beatsPerMeasure: 3, noteValue: 4 },
    })
    expect(next.song.timeSignature.beatsPerMeasure).toBe(3)
    const def = next.song.songSections.find((s) => s.id === "sec-default")!
    expect(def.bars[0].blocks[0].duration).toBe(3)
    const over = next.song.songSections.find((s) => s.id === "sec-override")!
    expect(over.bars[0].blocks[0].duration).toBe(3)
    expect(over.timeSignature?.beatsPerMeasure).toBe(3)
  })

  it("does not touch override section bars when only song default beats change", () => {
    const withSix = baseState()
    withSix.song.songSections[1] = {
      ...withSix.song.songSections[1],
      timeSignature: { beatsPerMeasure: 6, noteValue: 8 },
      bars: [
        {
          id: "bar-2",
          position: 1,
          blocks: [
            {
              id: "b2",
              type: "chord",
              duration: 6,
              position: 1,
              chord: { name: "G" },
            },
          ],
        },
      ],
    }
    const next = reducer(withSix, {
      type: "SET_TIME_SIGNATURE",
      v: { beatsPerMeasure: 3, noteValue: 4 },
    })
    const over = next.song.songSections.find((s) => s.id === "sec-override")!
    expect(over.bars[0].blocks[0].duration).toBe(6)
    expect(over.timeSignature).toEqual({ beatsPerMeasure: 6, noteValue: 8 })
  })
})

describe("SET_PENDING_SECTION_TIME_SIGNATURE", () => {
  const pending: PendingSongSection = {
    id: "pending",
    type: "VERSE",
    repeats: 1,
    bars: [
      {
        id: "bar-p",
        position: 1,
        blocks: [
          {
            id: "bp",
            type: "chord",
            duration: 4,
            position: 1,
            chord: { name: "Am" },
          },
        ],
      },
    ],
  }

  it("sets override and repacks pending bars", () => {
    const next = reducer(baseState({ pendingSection: pending }), {
      type: "SET_PENDING_SECTION_TIME_SIGNATURE",
      v: { beatsPerMeasure: 3, noteValue: 4 },
    })
    expect(next.pendingSection.timeSignature).toEqual({
      beatsPerMeasure: 3,
      noteValue: 4,
    })
    expect(next.pendingSection.bars[0].blocks[0].duration).toBe(3)
  })

  it("clears override and repacks to song default", () => {
    const next = reducer(
      baseState({
        pendingSection: {
          ...pending,
          timeSignature: { beatsPerMeasure: 3, noteValue: 4 },
          bars: [
            {
              id: "bar-p",
              position: 1,
              blocks: [
                {
                  id: "bp",
                  type: "chord",
                  duration: 3,
                  position: 1,
                  chord: { name: "Am" },
                },
              ],
            },
          ],
        },
      }),
      { type: "SET_PENDING_SECTION_TIME_SIGNATURE", v: undefined },
    )
    expect(next.pendingSection.timeSignature).toBeUndefined()
    expect(next.availableBeats).toBe(1)
  })
})
