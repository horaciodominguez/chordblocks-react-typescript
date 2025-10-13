import { v4 as uuidv4 } from "uuid"
import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: uuidv4(),
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: uuidv4(),
        type: "VERSE",
        bars: [
          {
            id: uuidv4(),
            position: 1,
            blocks: [
              {
                id: uuidv4(),
                type: "chord",
                chord: {
                  name: "G",
                },
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
                type: "rest",
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
                chord: {
                  name: "Am",
                },
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
                chord: {
                  name: "G",
                },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: {
                  name: "D",
                },
                duration: 2,
                position: 2,
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
                chord: {
                  name: "G",
                },
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
                chord: {
                  name: "D",
                },
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
                chord: {
                  name: "Am",
                },
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
                chord: {
                  name: "C",
                },
                duration: 2,
                position: 1,
              },
              {
                id: uuidv4(),
                type: "chord",
                chord: {
                  name: "G",
                },
                duration: 2,
                position: 2,
              },
            ],
          },
        ],
        repeats: 1,
      },
    ],
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
]
