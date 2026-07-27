import { v4 as uuidv4 } from "uuid"
import type { Bar } from "@/modules/songs/types/bar.types"
import type { Block } from "@/modules/songs/types/block.types"
import {
  barCapacity,
  remainingBeats,
} from "@/modules/songs/utils/beats"

/**
 * Ensure every bar fills its capacity by appending (or extending) rests.
 * Used when saving a section so incomplete measures are completed.
 */
export function padBarsWithRests(
  bars: Bar[],
  beatsPerMeasure: number,
  pickupBeats?: number,
): Bar[] {
  return bars.map((bar, index) => {
    const cap = barCapacity(beatsPerMeasure, index, pickupBeats)
    const rem = remainingBeats(bar, cap)

    if (rem <= 0) {
      return {
        ...bar,
        blocks: bar.blocks.map((block, i) => ({
          ...block,
          position: i + 1,
          ...(block.type === "chord" && block.chord
            ? { chord: { ...block.chord } }
            : {}),
        })),
      }
    }

    if (bar.blocks.length === 0) {
      const rest: Block = {
        id: uuidv4(),
        type: "rest",
        duration: cap,
        position: 1,
      }
      return { ...bar, blocks: [rest] }
    }

    const last = bar.blocks[bar.blocks.length - 1]
    if (last.type === "rest") {
      return {
        ...bar,
        blocks: bar.blocks.map((block, i) => {
          const base =
            i === bar.blocks.length - 1
              ? { ...block, duration: block.duration + rem }
              : { ...block }
          return {
            ...base,
            position: i + 1,
            ...(base.type === "chord" && base.chord
              ? { chord: { ...base.chord } }
              : {}),
          }
        }),
      }
    }

    const rest: Block = {
      id: uuidv4(),
      type: "rest",
      duration: rem,
      position: bar.blocks.length + 1,
    }

    return {
      ...bar,
      blocks: [
        ...bar.blocks.map((block, i) => ({
          ...block,
          position: i + 1,
          ...(block.type === "chord" && block.chord
            ? { chord: { ...block.chord } }
            : {}),
        })),
        rest,
      ],
    }
  })
}
