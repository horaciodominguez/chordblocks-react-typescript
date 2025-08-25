import type { Bar } from "../types/song.types"

export const beatsCap = (bpm: number, remaining: number) =>
  (remaining > 0 ? remaining : bpm)

export const nextBeatsValue = (cap: number) => {
  const opts = [1,2,3,4,6].filter(v => v <= cap)
  return String(opts.includes(4) ? 4 : opts[opts.length - 1])
}

export const remainingBeats = (bar: Bar, bpm: number) =>
  bpm - bar.chords.reduce((a,c)=>a + c.duration, 0)