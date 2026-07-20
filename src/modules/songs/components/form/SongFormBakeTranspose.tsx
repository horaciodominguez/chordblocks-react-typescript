import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import Label from "@/components/ui/Label"
import type { Action } from "@/modules/songs/state/songFormReducer"
import type { Song as SongType } from "@/modules/songs/types/song.types"

const BAKE_TRANSPOSE_MIN = -6
const BAKE_TRANSPOSE_MAX = 6

function formatOffset(semitones: number): string {
  return semitones > 0 ? `+${semitones}` : String(semitones)
}

type Props = {
  dispatch: React.Dispatch<Action>
  song: SongType
}

/**
 * F16: each stepper step rewrites the draft chart immediately (Key + all chords).
 * Save the song to persist. Distinct from F04 (read session) and F11 (set item).
 */
export function SongFormBakeTranspose({ dispatch, song }: Props) {
  const [sessionOffset, setSessionOffset] = useState(0)
  const [anchorKey] = useState(() => song.mainKey)

  const badge =
    sessionOffset !== 0
      ? anchorKey && song.mainKey
        ? `${formatOffset(sessionOffset)} · ${anchorKey} → ${song.mainKey}`
        : formatOffset(sessionOffset)
      : null

  const step = (delta: 1 | -1) => {
    const next = sessionOffset + delta
    if (next < BAKE_TRANSPOSE_MIN || next > BAKE_TRANSPOSE_MAX) return
    dispatch({ type: "BAKE_TRANSPOSE", v: delta })
    setSessionOffset(next)
  }

  return (
    <div className="mb-4 rounded-md border border-zinc-700/60 bg-zinc-900/40 px-3 py-3">
      <Label>Bake transpose</Label>
      <p className="text-xs text-zinc-500 mt-1 mb-3">
        Each step rewrites Key and all chords in the draft as the new original.
        Save the song to persist. Not the same as the read-only or set
        transpose.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bake transpose down"
            disabled={sessionOffset <= BAKE_TRANSPOSE_MIN}
            onClick={() => step(-1)}
            className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Minus size={16} />
          </button>
          <span
            className="min-w-10 text-center text-sm font-semibold text-zinc-200 tabular-nums"
            aria-live="polite"
          >
            {formatOffset(sessionOffset)}
          </span>
          <button
            type="button"
            aria-label="Bake transpose up"
            disabled={sessionOffset >= BAKE_TRANSPOSE_MAX}
            onClick={() => step(1)}
            className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus size={16} />
          </button>
        </div>

        {badge ? (
          <span className="text-xs font-medium text-amber-400/90 bg-amber-400/10 border border-amber-500/30 rounded px-2 py-1">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  )
}
