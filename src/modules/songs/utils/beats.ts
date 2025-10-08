import { BEAT_VALUES } from "../constants/song"
import type { Bar } from "../types/bar.types"

/**
 * Returns the maximum number of beats that can be used in a bar.
 * Example: in 4/4 the cap is 4, in 6/8 the cap is 6.
 * @param bpm
 * @param remaining
 * @returns number value of the cap
 */

export const beatsCap = (bpm: number, remaining: number) =>
  remaining > 0 ? remaining : bpm

/**
 * Returns the next valid beats value as a string, given the cap.
 * Example: if the cap is 4, returns "4", if the cap is 3, returns "3".
 * @param cap
 * @returns string value of the next valid beats value
 */

export const nextBeatsValue = (cap: number) => {
  const opts = BEAT_VALUES.filter((v) => v <= cap)
  return String(opts[opts.length - 1])
}

/**
 * Returns the number of remaining beats in a bar.
 * Example: in 4/4, if the bar has chords with total duration of 3, returns 1.
 * @param bar
 * @param bpm
 * @returns number value of remaining beats
 */

export const remainingBeats = (bar: Bar, bpm: number) =>
  bpm - bar.blocks.reduce((a, c) => a + c.duration, 0)
