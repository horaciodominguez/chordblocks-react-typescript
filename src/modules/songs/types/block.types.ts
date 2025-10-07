import type { Chord } from "@/modules/chords/types/chord.types"

export type BlockType = "chord" | "rest"

export interface Block {
  id: string
  type: BlockType
  duration: number
  position: number
  chord?: Chord
}
