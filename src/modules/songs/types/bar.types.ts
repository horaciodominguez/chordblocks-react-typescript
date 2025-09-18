export interface BarChord {
  id: string
  name: string
  duration: number
  position: number
}

export interface Bar {
  id: string
  chords: BarChord[]
  position: number
}
