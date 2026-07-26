import { describe, expect, it } from "vitest"
import { songWithPendingSectionFlushed } from "@/modules/songs/utils/songWithPendingSectionFlushed"
import type { SongFormState } from "@/modules/songs/state/songFormReducer"
import { initialSong } from "@/modules/songs/state/songFormReducer"

describe("songWithPendingSectionFlushed", () => {
  it("merges cueTime when editing a section without Save section", () => {
    const song = {
      ...initialSong,
      id: "song-1",
      title: "T",
      artist: "A",
      genre: "Rock",
      songSections: [
        {
          id: "sec-1",
          type: "VERSE" as const,
          repeats: 1,
          bars: [
            {
              id: "bar-1",
              position: 1,
              blocks: [
                {
                  id: "b1",
                  type: "chord" as const,
                  chord: { name: "C" },
                  duration: 4,
                  position: 1,
                },
              ],
            },
          ],
        },
      ],
    }

    const state = {
      song,
      pendingSection: {
        ...song.songSections[0],
        cueTime: 82,
      },
      editingSectionId: "sec-1",
      pendingBeats: "4",
      availableBeats: 4,
      errors: {},
    } as SongFormState

    const { song: next, didFlush } = songWithPendingSectionFlushed(state)
    expect(didFlush).toBe(true)
    expect(next.songSections[0].cueTime).toBe(82)
  })
})
