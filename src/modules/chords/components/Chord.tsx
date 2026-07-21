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
    <span className="flex flex-row items-end justify-center">
      <span className="text-center text-sm font-bold font-display text-zinc-200 light:text-zinc-800 guide:text-xs">
        {root}
      </span>
      {suffix && (
        <span className="mb-0.5 text-center text-xs font-thin italic font-display text-zinc-200 light:text-zinc-800 guide:mb-0 guide:text-[10px] guide:leading-none">
          {suffix}
        </span>
      )}
    </span>
  )
}
