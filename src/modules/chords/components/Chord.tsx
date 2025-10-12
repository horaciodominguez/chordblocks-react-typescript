import type { Chord } from "@/modules/chords/types/chord.types"
import {
  getChordByName,
  parseChordName,
} from "@/modules/chords/utils/chord.utils"

type Props = {
  chord?: string | Chord | null
  asText?: boolean
}

export default function Chord({ chord, asText = false }: Props) {
  if (!chord) return null

  const name = typeof chord === "string" ? chord : chord.name
  const resolved =
    typeof chord === "string"
      ? getChordByName(name) ?? parseChordName(name)
      : chord
  if (!resolved) return null

  const { root = "", suffix = "" } = resolved

  if (asText) return <>{root + suffix}</>

  return (
    <span className={`chord-display flex flex-row justify-center items-end`}>
      <span className={`chord-root `}>{root}</span>
      {suffix && <span className={`chord-suffix `}>{suffix}</span>}
    </span>
  )
}
