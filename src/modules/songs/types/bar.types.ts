/* export interface BarChord {
  id: string
  name: string
  duration: number
  position: number
  isRest?: boolean
}
 */
import type { Block } from "@/modules/songs/types/block.types"

export interface Bar {
  id: string
  chords: Block[]
  position: number
}
