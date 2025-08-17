import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: "1",
    title: "Knockin' on Heaven's Door",
    author: "Bob Dylan",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [ { id: "c1", name: "G", duration: 4 } ] },
          { id: "bar2", chords: [ { id: "c2", name: "D", duration: 4 } ] },
          { id: "bar3", chords: [ { id: "c3", name: "Am", duration: 4 } ] },
          { id: "bar4", chords: [ 
            { id: "c4", name: "G", duration: 2 }, 
            { id: "c5", name: "D", duration: 2 } 
          ] }
        ]
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [ { id: "c6", name: "G", duration: 4 } ] },
          { id: "bar6", chords: [ { id: "c7", name: "D", duration: 4 } ] },
          { id: "bar7", chords: [ { id: "c8", name: "Am", duration: 4 } ] },
          { id: "bar8", chords: [ { id: "c9", name: "C", duration: 2 }, { id: "c10", name: "G", duration: 2 } ] },
        ]
      }
    ]
  },

  {
    id: "2",
    title: "Hallelujah",
    author: "Leonard Cohen",
    timeSignature: { beatsPerMeasure: 6, noteValue: 8 }, // 6/8
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [ { id: "c1", name: "C", duration: 6 } ] },
          { id: "bar2", chords: [ { id: "c2", name: "Am", duration: 6 } ] },
          { id: "bar3", chords: [ 
            { id: "c3", name: "C", duration: 3 }, 
            { id: "c4", name: "Am", duration: 3 } ] },
          { id: "bar4", chords: [ { id: "c5", name: "F", duration: 6 } ] },
        ]
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [ { id: "c6", name: "C", duration: 6 } ] },
          { id: "bar6", chords: [ { id: "c7", name: "F", duration: 6 } ] },
          { id: "bar7", chords: [ { id: "c8", name: "Am", duration: 3 }, { id: "c9", name: "F", duration: 3 } ] },
          { id: "bar8", chords: [ { id: "c10", name: "G", duration: 6 } ] },
        ]
      }
    ]
  },

  {
    id: "3",
    title: "Let It Be",
    author: "The Beatles",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [ { id: "c1", name: "C", duration: 4 } ] },
          { id: "bar2", chords: [ { id: "c2", name: "G", duration: 4 } ] },
          { id: "bar3", chords: [ { id: "c3", name: "Am", duration: 4 } ] },
          { id: "bar4", chords: [ { id: "c4", name: "F", duration: 4 } ] },
        ]
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [ { id: "c5", name: "C", duration: 2 }, { id: "c6", name: "G", duration: 2 } ] },
          { id: "bar6", chords: [ { id: "c7", name: "Am", duration: 4 } ] },
          { id: "bar7", chords: [ { id: "c8", name: "F", duration: 2 }, { id: "c9", name: "C", duration: 2 } ] },
          { id: "bar8", chords: [ { id: "c10", name: "C", duration: 4 } ] },
        ]
      }
    ]
  },

  {
    id: "4",
    title: "La Cumparsita",
    author: "Gerardo Matos Rodríguez",
    timeSignature: { beatsPerMeasure: 2, noteValue: 4 }, // 2/4 (tango clásico)
    songSections: [
      {
        id: "sec1",
        type: "INTRO",
        bars: [
          { id: "bar1", chords: [ { id: "c1", name: "Am", duration: 2 } ] },
          { id: "bar2", chords: [ { id: "c2", name: "E7", duration: 2 } ] },
          { id: "bar3", chords: [ { id: "c3", name: "Am", duration: 2 } ] },
          { id: "bar4", chords: [ { id: "c4", name: "E7", duration: 2 } ] },
        ]
      },
      {
        id: "sec2",
        type: "VERSE",
        bars: [
          { id: "bar5", chords: [ { id: "c5", name: "Am", duration: 1 }, { id: "c6", name: "E7", duration: 1 } ] },
          { id: "bar6", chords: [ { id: "c7", name: "Am", duration: 2 } ] },
          { id: "bar7", chords: [ { id: "c8", name: "Dm", duration: 2 } ] },
          { id: "bar8", chords: [ { id: "c9", name: "E7", duration: 2 } ] },
        ]
      }
    ]
  }
];