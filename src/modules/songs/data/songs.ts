import { v4 as uuidv4 } from "uuid"
import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: "01b106ea-5559-4294-8414-0cb674b0cfb3",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    genre: "Folk Rock",
    year: 1973,
    imageUrl: null,
    imageBase64: null,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: uuidv4(),
        type: "INTRO",
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: uuidv4(),
        type: "VERSE", // Verso 1: "Mama take this badge off of me..."
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: uuidv4(),
        type: "CHORUS", // "Knock, knock, knockin' on heaven's door"
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: uuidv4(),
        type: "VERSE", // Verso 2: "Mama put my guns in the ground..."
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: uuidv4(),
        type: "CHORUS",
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: uuidv4(),
        type: "OUTRO", // Solo/Coros finales
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 4,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  {
    id: "1e26b321-8d51-4b4b-9ce4-2cf596f87870",
    title: "Have You Ever Seen the Rain",
    artist: "Creedence Clearwater Revival",
    genre: "Roots Rock",
    year: 1971,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: uuidv4(),
        type: "INTRO",
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 5,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: uuidv4(),
        type: "VERSE", // "Someone told me long ago..."
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 5,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 6,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: uuidv4(),
        type: "VERSE", // "Yesterday and days before..."
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 5,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 6,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: uuidv4(),
        type: "CHORUS", // "I want to know, have you ever seen the rain?"
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2, // Se repite dos veces por cada estribillo
      },
      {
        id: uuidv4(),
        type: "VERSE", // "Sun is shining on a cloudy day..."
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 5,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 6,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: uuidv4(),
        type: "CHORUS", // Repetición del estribillo tras el tercer verso
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "Am" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 3,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 4,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: uuidv4(),
        type: "OUTRO",
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: uuidv4(),
            position: 2,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]
