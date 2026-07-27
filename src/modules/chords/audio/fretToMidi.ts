/** Open-string MIDI (string 6 → 1, low E to high e). */
export const GUITAR_OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64] as const

export type ChordShape = {
  frets: (number | null)[]
  baseFret: number
}

/** Map frets array (6→1) to sounded MIDI notes. */
export function fretsToMidi(
  frets: readonly (number | null)[],
  openMidi: readonly number[] = GUITAR_OPEN_STRING_MIDI,
): number[] {
  const notes: number[] = []
  for (let i = 0; i < frets.length && i < openMidi.length; i++) {
    const f = frets[i]
    if (f == null || f < 0) continue
    notes.push(openMidi[i]! + f)
  }
  return [...new Set(notes)].sort((a, b) => a - b)
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}
