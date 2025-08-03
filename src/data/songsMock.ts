// MOCK
import { type Song } from "../types/song"

export const songsMock: Song[] = [
  {
    id: '1',
    title: 'Eres Mi Religión',
    author: 'Maná',
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: 'intro-1',
        type: "INTRO",
        blocks: [
          {
            chords: [
              { name: "E", beats: 4 },
              { name: "B/#D", beats: 4 },
              { name: "#Cm", beats: 8 }
            ]
          }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        blocks: [
          {
            chords: [
              { name: "#Fm", beats: 4 },
              { name: "B", beats: 4 },
              { name: "E", beats: 4 },
              { name: "A", beats: 4 }
            ]
          },
          {
            chords: [
              { name: "#Fm", beats: 4 },
              { name: "B", beats: 4 },
              { name: "E", beats: 8 }
            ]
          }
        ]
      },
      {
        id: 'pre-chorus-1',
        type: "PRE-CHORUS",
        blocks: [
          {
            chords: [
              { name: "B", beats: 4 },
              { name: "B", beats: 4 },
              { name: "C#m", beats: 2 },
              { name: "B", beats: 2 },
              { name: "Bb", beats: 4 }
            ]
          },
          {
            chords: [
              { name: "A", beats: 4 },
              { name: "B", beats: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Wonderwall',
    author: 'Oasis',
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: 'intro-1',
        type: "INTRO",
        blocks: [
          {
            chords: [
              { name: "Em7", beats: 4 },
              { name: "G", beats: 4 },
              { name: "Dsus4", beats: 4 },
              { name: "A7sus4", beats: 4 }
            ]
          }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        blocks: [
          {
            chords: [
              { name: "Em7", beats: 4 },
              { name: "G", beats: 4 },
              { name: "Dsus4", beats: 4 },
              { name: "A7sus4", beats: 4 }
            ]
          },
          {
            chords: [
              { name: "Cadd9", beats: 8 },
              { name: "Dsus4", beats: 4 },
              { name: "A7sus4", beats: 4 }
            ]
          }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        blocks: [
          {
            chords: [
              { name: "Em7", beats: 4 },
              { name: "G", beats: 4 },
              { name: "Cadd9", beats: 4 },
              { name: "Dsus4", beats: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Knockin’ on Heaven’s Door',
    author: 'Bob Dylan',
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: 'verse-1',
        type: "VERSE",
        blocks: [
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "D", beats: 4 },
              { name: "Am7", beats: 8 }
            ]
          },
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "D", beats: 4 },
              { name: "C", beats: 8 }
            ]
          }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        blocks: [
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "C", beats: 4 },
              { name: "G", beats: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Hotel California',
    author: 'Eagles',
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: 'intro-1',
        type: "INTRO",
        blocks: [
          {
            chords: [
              { name: "Bm", beats: 4 },
              { name: "F#", beats: 4 },
              { name: "A", beats: 4 },
              { name: "E", beats: 4 }
            ]
          },
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "D", beats: 4 },
              { name: "Em", beats: 4 },
              { name: "F#", beats: 4 }
            ]
          }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        blocks: [
          {
            chords: [
              { name: "Bm", beats: 4 },
              { name: "F#", beats: 4 },
              { name: "A", beats: 4 },
              { name: "E", beats: 4 }
            ]
          },
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "D", beats: 4 },
              { name: "Em", beats: 4 },
              { name: "F#", beats: 4 }
            ]
          }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        blocks: [
          {
            chords: [
              { name: "G", beats: 4 },
              { name: "D", beats: 4 },
              { name: "Em", beats: 4 },
              { name: "F#", beats: 4 }
            ]
          }
        ]
      }
    ]
  }
]
