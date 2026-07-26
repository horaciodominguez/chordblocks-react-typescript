import type { SongSection } from "@/modules/songs/types/section.types"
import type { SongDensity } from "@/modules/songs/types/density.types"

/** Max blocks in any bar — drives how many measures fit per row. */
export function maxBlocksPerBar(section: SongSection): number {
  let max = 0
  for (const bar of section.bars) {
    if (bar.blocks.length > max) max = bar.blocks.length
  }
  return max
}

/**
 * Target measures-per-row hint from densest bar.
 * Higher block counts → fewer columns (more room per chord).
 */
export function setBarsByLine(section: SongSection): number {
  const maxChords = maxBlocksPerBar(section)
  if (maxChords >= 6) return 1
  if (maxChords >= 4) return 2
  if (maxChords >= 2) return 3
  return 4
}

/**
 * Tailwind grid column classes for measure layout.
 * Guide/Play is deliberately more conservative — atril fonts need width.
 */
export function sectionBarsColClass(
  cols: number,
  density: SongDensity,
  maxChords: number,
): string {
  if (density === "guide") {
    // Prefer width for chord glyphs over packing measures side-by-side.
    if (maxChords >= 4) return "grid-cols-1"
    if (maxChords >= 3) return "grid-cols-1 sm:grid-cols-2"
    if (maxChords >= 2) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
  }

  if (cols === 1) return "grid-cols-1"
  if (cols === 2) return "grid-cols-1 sm:grid-cols-2"
  if (cols === 3) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
}
