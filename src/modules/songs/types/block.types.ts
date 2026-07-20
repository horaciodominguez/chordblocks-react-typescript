import type { Chord } from "@/modules/chords/types/chord.types"

export type BlockType = "chord" | "rest" | "riff" | "solo"

export interface Block {
  id: string
  type: BlockType
  duration: number
  position: number
  chord?: Chord
  /** Keep-style riff name (e.g. "Riff 1"). Only for type "riff". */
  label?: string
}
