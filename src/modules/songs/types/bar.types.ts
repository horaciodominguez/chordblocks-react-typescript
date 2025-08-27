export interface BarChord {
  id: string
  name: string
  duration: number
}

export interface Bar {
  id: string
  chords: BarChord[]
}
