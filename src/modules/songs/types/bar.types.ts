import type { Block } from "@/modules/songs/types/block.types"

export interface Bar {
  id: string
  blocks: Block[]
  position: number
}
