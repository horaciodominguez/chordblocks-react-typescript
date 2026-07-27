import { BLOCK_BEAT_VALUES } from "../constants/song"
import type { Bar } from "../types/bar.types"

/**
 * Returns the maximum number of beats that can be used in a bar.
 * Example: in 4/4 the cap is 4, in 6/8 the cap is 6.
 * When remaining is 0, returns `nextBarCap` (default: same as bpm).
 */
export const beatsCap = (
  bpm: number,
  remaining: number,
  nextBarCap: number = bpm,
) => (remaining > 0 ? remaining : nextBarCap)

/**
 * Returns the next valid beats value as a string, given the cap.
 */
export const nextBeatsValue = (cap: number) => {
  const opts = BLOCK_BEAT_VALUES.filter((v) => v <= cap)
  return String(opts[opts.length - 1] ?? 1)
}

/**
 * Returns the number of remaining beats in a bar relative to `capacity`.
 */
export const remainingBeats = (bar: Bar, capacity: number) =>
  capacity - bar.blocks.reduce((a, c) => a + c.duration, 0)

/** Valid duration options for an existing block within its bar. */
export const allowedBlockDurations = (
  bar: Bar,
  blockId: string,
  capacity: number,
) => {
  const block = bar.blocks.find((b) => b.id === blockId)
  if (!block) return BLOCK_BEAT_VALUES.filter((v) => v <= capacity)
  const max = block.duration + remainingBeats(bar, capacity)
  return BLOCK_BEAT_VALUES.filter((v) => v <= max)
}

/**
 * Pickup must be a positive incomplete measure (1 … beatsPerMeasure-1).
 */
export function normalizePickupBeats(
  pickupBeats: number | undefined,
  beatsPerMeasure: number,
): number | undefined {
  if (pickupBeats == null || !Number.isFinite(pickupBeats)) return undefined
  const n = Math.floor(pickupBeats)
  if (n < 1 || n >= beatsPerMeasure) return undefined
  return n
}

/** Capacity of bar at `barIndex` (0 = first / possible pickup). */
export function barCapacity(
  beatsPerMeasure: number,
  barIndex: number,
  pickupBeats?: number,
): number {
  const pickup = normalizePickupBeats(pickupBeats, beatsPerMeasure)
  if (barIndex === 0 && pickup != null) return pickup
  return beatsPerMeasure
}
