import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { PendingSongSection } from "@/modules/songs/types/section.types"

function pendingWithBars(
  overrides: Partial<PendingSongSection> = {},
): PendingSongSection {
  return {
    id: "pending-1",
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
    ...overrides,
  }
}

function baseState(
  overrides: Partial<SongFormState> = {},
): SongFormState {
  return {
    song: {
      ...initialSong,
      title: "T",
      artist: "A",
      genre: "G",
    },
    pendingSection: pendingWithBars(),
    editingSectionId: "pending-1",
    pendingBeats: "4",
    availableBeats: 0,
    errors: {},
    ...overrides,
  }
}

describe("SET_PENDING_SECTION_PICKUP_BEATS", () => {
  it("sets pickup and repacks first bar to pickup capacity", () => {
    const next = reducer(baseState(), {
      type: "SET_PENDING_SECTION_PICKUP_BEATS",
      v: 1,
    })
    expect(next.pendingSection.pickupBeats).toBe(1)
    expect(next.pendingSection.bars[0].blocks[0].duration).toBe(1)
    expect(next.availableBeats).toBe(4)
  })

  it("clears pickup and restores full-measure packing", () => {
    const withPickup = baseState({
      pendingSection: pendingWithBars({ pickupBeats: 1 }),
    })
    const next = reducer(withPickup, {
      type: "SET_PENDING_SECTION_PICKUP_BEATS",
      v: undefined,
    })
    expect(next.pendingSection.pickupBeats).toBeUndefined()
    expect(next.pendingSection.bars[0].blocks[0].duration).toBe(4)
  })

  it("drops invalid pickup when section meter shrinks", () => {
    const withPickup = baseState({
      pendingSection: pendingWithBars({
        pickupBeats: 3,
        timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
      }),
    })
    const next = reducer(withPickup, {
      type: "SET_PENDING_SECTION_TIME_SIGNATURE",
      v: { beatsPerMeasure: 3, noteValue: 4 },
    })
    expect(next.pendingSection.pickupBeats).toBeUndefined()
  })
})
