import type { Chord } from "@/modules/chords/types/chord.types"

export type BlockType = "chord" | "rest" | "riff" | "solo"

export interface Block {
  id: string
  type: BlockType
  duration: number
  position: number
  chord?: Chord
  /**
   * Reference time in the song's YouTube video, in seconds.
   * Only for types "riff" and "solo".
   */
  refTime?: number
  /**
   * Optional lyric fragment aligned under this block (atril / edit).
   * Empty / omitted = no lyric for this beat span.
   */
  lyric?: string
}
