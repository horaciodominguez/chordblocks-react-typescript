import { describe, it, expect } from "vitest"
import {
  initialSong,
  reducer,
  type SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { Song } from "@/modules/songs/types/song.types"

function baseState(song: Song): SongFormState {
  return {
    song,
    pendingSection: { id: "", type: "", bars: [], repeats: 1 },
    editingSectionId: null,
    pendingBeats: "4",
    availableBeats: 4,
    errors: {},
  }
}

function sampleSong(): Song {
  return {
    ...initialSong,
    id: "song-1",
    title: "Human Nature",
    artist: "Michael Jackson",
    mainKey: "Bm",
    songSections: [
      {
        id: "sec-1",
        type: "VERSE",
        label: "A",
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
                chord: { name: "Bm" },
              },
            ],
          },
        ],
      },
    ],
  }
}

describe("BAKE_TRANSPOSE", () => {
  it("rewrites song chords and mainKey in form state", () => {
    const state = baseState(sampleSong())
    const next = reducer(state, { type: "BAKE_TRANSPOSE", v: 1 })

    expect(next.song.mainKey).toBe("Cm")
    expect(next.song.songSections[0].bars[0].blocks[0].chord?.name).toBe("Cm")
    expect(state.song.mainKey).toBe("Bm")
  })

  it("is a no-op at 0 semitones", () => {
    const state = baseState(sampleSong())
    const next = reducer(state, { type: "BAKE_TRANSPOSE", v: 0 })
    expect(next).toBe(state)
  })

  it("also bakes pending section bars and pending chord block", () => {
    const state: SongFormState = {
      ...baseState(sampleSong()),
      pendingSection: {
        id: "pending-1",
        type: "CHORUS",
        bars: [
          {
            id: "pbar-1",
            position: 1,
            blocks: [
              {
                id: "pb1",
                type: "chord",
                duration: 4,
                position: 1,
                chord: { name: "F#m" },
              },
            ],
          },
        ],
        repeats: 1,
      },
      pendingBlock: {
        id: "temp",
        type: "chord",
        duration: 0,
        position: 0,
        chord: { name: "A" },
      },
    }

    const next = reducer(state, { type: "BAKE_TRANSPOSE", v: 1 })

    expect(next.pendingSection.bars[0].blocks[0].chord?.name).toBe("Gm")
    expect(next.pendingBlock?.chord?.name).toBe("A#")
    expect(next.song.mainKey).toBe("Cm")
  })
})
