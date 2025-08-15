import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: '1',
    title: 'Eres Mi Religión',
    author: 'Maná',
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: 'intro-1',
        type: "INTRO",
        chords: [
          { name: "E", beats: 4 },
          { name: "B/#D", beats: 4 },
          { name: "#Cm", beats: 8 }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        chords: [
          { name: "#Fm", beats: 4 },
          { name: "B", beats: 4 },
          { name: "E", beats: 4 },
          { name: "A", beats: 4 },
          { name: "#Fm", beats: 4 },
          { name: "B", beats: 4 },
          { name: "E", beats: 8 }
        ]
      },
      {
        id: 'pre-chorus-1',
        type: "PRE-CHORUS",
        chords: [
          { name: "B", beats: 4 },
          { name: "B", beats: 4 },
          { name: "C#m", beats: 2 },
          { name: "B", beats: 2 },
          { name: "Bb", beats: 4 },
          { name: "A", beats: 4 },
          { name: "B", beats: 4 }
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
        chords: [
          { name: "Em7", beats: 4 },
          { name: "G", beats: 4 },
          { name: "Dsus4", beats: 4 },
          { name: "A7sus4", beats: 4 }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        chords: [
          { name: "Em7", beats: 4 },
          { name: "G", beats: 4 },
          { name: "Dsus4", beats: 4 },
          { name: "A7sus4", beats: 4 },
          { name: "Cadd9", beats: 8 },
          { name: "Dsus4", beats: 4 },
          { name: "A7sus4", beats: 4 }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        chords: [
          { name: "Em7", beats: 4 },
          { name: "G", beats: 4 },
          { name: "Cadd9", beats: 4 },
          { name: "Dsus4", beats: 4 }
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
        chords: [
          { name: "G", beats: 4 },
          { name: "D", beats: 4 },
          { name: "Am7", beats: 8 },
          { name: "G", beats: 4 },
          { name: "D", beats: 4 },
          { name: "C", beats: 8 }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        chords: [
          { name: "G", beats: 4 },
          { name: "C", beats: 4 },
          { name: "G", beats: 4 }
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
        chords: [
          { name: "Bm", beats: 4 },
          { name: "F#", beats: 4 },
          { name: "A", beats: 4 },
          { name: "E", beats: 4 },
          { name: "G", beats: 4 },
          { name: "D", beats: 4 },
          { name: "Em", beats: 4 },
          { name: "F#", beats: 4 }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        chords: [
          { name: "Bm", beats: 4 },
          { name: "F#", beats: 4 },
          { name: "A", beats: 4 },
          { name: "E", beats: 4 },
          { name: "G", beats: 4 },
          { name: "D", beats: 4 },
          { name: "Em", beats: 4 },
          { name: "F#", beats: 4 }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
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
    id: '5',
    title: 'El Vals del Ocaso',
    author: 'Anónimo',
    timeSignature: { beatsPerMeasure: 3, noteValue: 4 },
    songSections: [
      {
        id: 'intro-1',
        type: "INTRO",
        chords: [
          { name: "Am", beats: 3 },
          { name: "E", beats: 3 },
          { name: "Am", beats: 3 },
          { name: "E", beats: 3 }
        ]
      },
      {
        id: 'verse-1',
        type: "VERSE",
        chords: [
          { name: "Dm", beats: 3 },
          { name: "Am", beats: 3 },
          { name: "E", beats: 3 },
          { name: "Am", beats: 3 },
          { name: "Dm", beats: 3 },
          { name: "Am", beats: 3 },
          { name: "E", beats: 3 },
          { name: "Am", beats: 3 }
        ]
      },
      {
        id: 'chorus-1',
        type: "CHORUS",
        chords: [
          { name: "C", beats: 3 },
          { name: "G", beats: 3 },
          { name: "C", beats: 3 },
          { name: "G", beats: 3 },
          { name: "Am", beats: 3 },
          { name: "E", beats: 3 },
          { name: "Am", beats: 3 }
        ]
      },
      {
        id: 'bridge-1',
        type: "BRIDGE",
        chords: [
          { name: "F", beats: 3 },
          { name: "C", beats: 3 },
          { name: "G", beats: 3 },
          { name: "C", beats: 3 }
        ]
      }
    ]
  }
];