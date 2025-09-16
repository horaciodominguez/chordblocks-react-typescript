import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: "1",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "G", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "D", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          {
            id: "bar4",
            chords: [
              { id: "c4", name: "G", duration: 2 },
              { id: "c5", name: "D", duration: 2 },
            ],
          },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c6", name: "G", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c7", name: "D", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c8", name: "Am", duration: 4 }] },
          {
            id: "bar8",
            chords: [
              { id: "c9", name: "C", duration: 2 },
              { id: "c10", name: "G", duration: 2 },
            ],
          },
        ],
      },
    ],
  },
]
