import { v4 as uuidv4 } from "uuid"

import type { SongSection } from "@/modules/songs/types/section.types"

/** Deep-clone a song section while generating fresh IDs for its nested content. */
export function cloneSectionWithNewIds(section: SongSection): SongSection {
  return {
    ...section,
    id: uuidv4(),
    bars: section.bars.map((bar) => ({
      ...bar,
      id: uuidv4(),
      blocks: bar.blocks.map((block) => ({
        ...block,
        id: uuidv4(),
        ...(block.chord ? { chord: { ...block.chord } } : {}),
      })),
    })),
  }
}
