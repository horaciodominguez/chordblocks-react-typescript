import { v4 as uuidv4 } from "uuid"
import type { Bar } from "@/modules/songs/types/bar.types"
import type { Block } from "@/modules/songs/types/block.types"
import { normalizePickupBeats } from "@/modules/songs/utils/beats"

/**
 * Clamp block durations and re-pack into bars that fit.
 * Optional `pickupBeats` makes the first packed bar shorter (anacrusis).
 * Preserves block identities; generates new bar ids.
 */
export function repackBarsToCapacity(
  bars: Bar[],
  beatsPerMeasure: number,
  pickupBeats?: number,
): Bar[] {
  const bpm = Math.max(1, Math.floor(beatsPerMeasure))
  const pickup = normalizePickupBeats(pickupBeats, bpm)
  const flat: Block[] = bars.flatMap((bar) =>
    bar.blocks.map((block) => ({
      ...block,
      ...(block.chord ? { chord: { ...block.chord } } : {}),
      duration: Math.min(Math.max(1, block.duration), bpm),
    })),
  )

  if (flat.length === 0) return []

  const packed: Bar[] = []
  let current: Block[] = []
  let used = 0
  let cap = pickup ?? bpm

  const flush = () => {
    if (current.length === 0) return
    packed.push({
      id: uuidv4(),
      position: packed.length + 1,
      blocks: current.map((block, i) => ({ ...block, position: i + 1 })),
    })
    current = []
    used = 0
    // After the first (possible pickup) bar, always use full measure capacity.
    cap = bpm
  }

  for (const block of flat) {
    let duration = block.duration
    if (duration > cap) {
      // Prefer fitting into current short pickup by clamping once; leftover
      // would need split — we keep whole blocks and spill to next bar.
      if (used === 0) {
        duration = cap
      } else {
        flush()
        duration = Math.min(block.duration, cap)
      }
    }
    if (used + duration > cap) {
      flush()
      duration = Math.min(block.duration, cap)
    }
    current.push({ ...block, duration })
    used += duration
    if (used >= cap) {
      flush()
    }
  }
  flush()

  return packed
}
