import { v4 as uuidv4 } from "uuid"
import type { Bar } from "@/modules/songs/types/bar.types"
import type { Block } from "@/modules/songs/types/block.types"

/**
 * Clamp block durations to `beatsPerMeasure` and re-pack into bars that fit.
 * Preserves block identities; generates new bar ids.
 */
export function repackBarsToCapacity(
  bars: Bar[],
  beatsPerMeasure: number,
): Bar[] {
  const bpm = Math.max(1, Math.floor(beatsPerMeasure))
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

  const flush = () => {
    if (current.length === 0) return
    packed.push({
      id: uuidv4(),
      position: packed.length + 1,
      blocks: current.map((block, i) => ({ ...block, position: i + 1 })),
    })
    current = []
    used = 0
  }

  for (const block of flat) {
    if (used + block.duration > bpm) {
      flush()
    }
    current.push(block)
    used += block.duration
    if (used >= bpm) {
      flush()
    }
  }
  flush()

  return packed
}
