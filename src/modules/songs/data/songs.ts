import { v4 as uuidv4 } from "uuid"
import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: uuidv4(),
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    genre: "Folk Rock",
    year: 1973,
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
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-12-22T00:00:00.000Z",
  },

  {
    id: "uuid-wish-you-were-here",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    genre: "Progressive Rock",
    year: 1975,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "uuid-wywh-intro",
        type: "INTRO",
        bars: [
          {
            id: "uuid-b1",
            position: 1,
            blocks: [
              {
                id: "uuid-bl1",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b2",
            position: 2,
            blocks: [
              {
                id: "uuid-bl2",
                type: "chord",
                chord: { name: "Em7" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b3",
            position: 3,
            blocks: [
              {
                id: "uuid-bl3",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b4",
            position: 4,
            blocks: [
              {
                id: "uuid-bl4",
                type: "chord",
                chord: { name: "Em7" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b5",
            position: 5,
            blocks: [
              {
                id: "uuid-bl5",
                type: "chord",
                chord: { name: "A7sus4" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b6",
            position: 6,
            blocks: [
              {
                id: "uuid-bl6",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "uuid-wywh-verse",
        type: "VERSE",
        bars: [
          {
            id: "uuid-b7",
            position: 1,
            blocks: [
              {
                id: "uuid-bl7",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b8",
            position: 2,
            blocks: [
              {
                id: "uuid-bl8",
                type: "chord",
                chord: { name: "D" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b9",
            position: 3,
            blocks: [
              {
                id: "uuid-bl9",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b10",
            position: 4,
            blocks: [
              {
                id: "uuid-bl10",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b11",
            position: 5,
            blocks: [
              {
                id: "uuid-bl11",
                type: "chord",
                chord: { name: "D" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b12",
            position: 6,
            blocks: [
              {
                id: "uuid-bl12",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b13",
            position: 7,
            blocks: [
              {
                id: "uuid-bl13",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b14",
            position: 8,
            blocks: [
              {
                id: "uuid-bl14",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "uuid-wywh-outro",
        type: "OUTRO",
        bars: [
          {
            id: "uuid-b15",
            position: 1,
            blocks: [
              {
                id: "uuid-bl15",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b16",
            position: 2,
            blocks: [
              {
                id: "uuid-bl16",
                type: "chord",
                chord: { name: "Em7" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 4,
      },
    ],
    createdAt: "2025-12-23T00:00:00.000Z",
    updatedAt: "2025-12-23T00:00:00.000Z",
  },
  {
    id: "uuid-have-you-ever",
    title: "Have You Ever Seen the Rain",
    artist: "Creedence Clearwater Revival",
    genre: "Folk Rock",
    year: 1971,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "uuid-ccr-intro",
        type: "INTRO",
        bars: [
          {
            id: "uuid-b17",
            position: 1,
            blocks: [
              {
                id: "uuid-bl17",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b18",
            position: 2,
            blocks: [
              {
                id: "uuid-bl18",
                type: "chord",
                chord: { name: "F" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b19",
            position: 3,
            blocks: [
              {
                id: "uuid-bl19",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b20",
            position: 4,
            blocks: [
              {
                id: "uuid-bl20",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: "uuid-ccr-verse",
        type: "VERSE",
        bars: [
          {
            id: "uuid-b21",
            position: 1,
            blocks: [
              {
                id: "uuid-bl21",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b22",
            position: 2,
            blocks: [
              {
                id: "uuid-bl22",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b23",
            position: 3,
            blocks: [
              {
                id: "uuid-bl23",
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
        id: "uuid-ccr-chorus",
        type: "CHORUS",
        bars: [
          {
            id: "uuid-b24",
            position: 1,
            blocks: [
              {
                id: "uuid-bl24",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "uuid-bl25",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "uuid-b25",
            position: 2,
            blocks: [
              {
                id: "uuid-bl26",
                type: "chord",
                chord: { name: "C" },
                duration: 2,
                position: 1,
              },
              {
                id: "uuid-bl27",
                type: "chord",
                chord: { name: "Am" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "uuid-b26",
            position: 3,
            blocks: [
              {
                id: "uuid-bl28",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "uuid-bl29",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "uuid-b27",
            position: 4,
            blocks: [
              {
                id: "uuid-bl30",
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
    createdAt: "2025-12-23T00:00:00.000Z",
    updatedAt: "2025-12-23T00:00:00.000Z",
  },
  {
    id: "uuid-every-breath",
    title: "Every Breath You Take",
    artist: "The Police",
    genre: "Rock",
    year: 1983,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "uuid-police-verse",
        type: "VERSE",
        bars: [
          {
            id: "uuid-b28",
            position: 1,
            blocks: [
              {
                id: "uuid-bl31",
                type: "chord",
                chord: { name: "A" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b29",
            position: 2,
            blocks: [
              {
                id: "uuid-bl32",
                type: "chord",
                chord: { name: "F#m" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b30",
            position: 3,
            blocks: [
              {
                id: "uuid-bl33",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 1,
              },
              {
                id: "uuid-bl34",
                type: "chord",
                chord: { name: "E" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "uuid-b31",
            position: 4,
            blocks: [
              {
                id: "uuid-bl35",
                type: "chord",
                chord: { name: "A" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 4,
      },
      {
        id: "uuid-police-bridge",
        type: "BRIDGE",
        bars: [
          {
            id: "uuid-b32",
            position: 1,
            blocks: [
              {
                id: "uuid-bl36",
                type: "chord",
                chord: { name: "Bb" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b33",
            position: 2,
            blocks: [
              {
                id: "uuid-bl37",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b34",
            position: 3,
            blocks: [
              {
                id: "uuid-bl38",
                type: "chord",
                chord: { name: "Bb" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b35",
            position: 4,
            blocks: [
              {
                id: "uuid-bl39",
                type: "chord",
                chord: { name: "A" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
    ],
    createdAt: "2025-12-23T00:00:00.000Z",
    updatedAt: "2025-12-23T00:00:00.000Z",
  },
  {
    id: "uuid-wild-horses",
    title: "Wild Horses",
    artist: "The Rolling Stones",
    genre: "Rock",
    year: 1971,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "uuid-stones-intro",
        type: "INTRO",
        bars: [
          {
            id: "uuid-b36",
            position: 1,
            blocks: [
              {
                id: "uuid-bl40",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b37",
            position: 2,
            blocks: [
              {
                id: "uuid-bl41",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b38",
            position: 3,
            blocks: [
              {
                id: "uuid-bl42",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b39",
            position: 4,
            blocks: [
              {
                id: "uuid-bl43",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
      {
        id: "uuid-stones-verse",
        type: "VERSE",
        bars: [
          {
            id: "uuid-b40",
            position: 1,
            blocks: [
              {
                id: "uuid-bl44",
                type: "chord",
                chord: { name: "Bm" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b41",
            position: 2,
            blocks: [
              {
                id: "uuid-bl45",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b42",
            position: 3,
            blocks: [
              {
                id: "uuid-bl46",
                type: "chord",
                chord: { name: "Bm" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b43",
            position: 4,
            blocks: [
              {
                id: "uuid-bl47",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b44",
            position: 5,
            blocks: [
              {
                id: "uuid-bl48",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b45",
            position: 6,
            blocks: [
              {
                id: "uuid-bl49",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b46",
            position: 7,
            blocks: [
              {
                id: "uuid-bl50",
                type: "chord",
                chord: { name: "D" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b47",
            position: 8,
            blocks: [
              {
                id: "uuid-bl51",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 3,
      },
      {
        id: "uuid-stones-chorus",
        type: "CHORUS",
        bars: [
          {
            id: "uuid-b48",
            position: 1,
            blocks: [
              {
                id: "uuid-bl52",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b49",
            position: 2,
            blocks: [
              {
                id: "uuid-bl53",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b50",
            position: 3,
            blocks: [
              {
                id: "uuid-bl54",
                type: "chord",
                chord: { name: "D" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b51",
            position: 4,
            blocks: [
              {
                id: "uuid-bl55",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b52",
            position: 5,
            blocks: [
              {
                id: "uuid-bl56",
                type: "chord",
                chord: { name: "F" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "uuid-b53",
            position: 6,
            blocks: [
              {
                id: "uuid-bl57",
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
    createdAt: "2025-12-23T00:00:00.000Z",
    updatedAt: "2025-12-23T00:00:00.000Z",
  },
]
