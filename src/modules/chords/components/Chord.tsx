import React, { forwardRef } from "react"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import type { BarChord } from "@/modules/songs/types/bar.types"
import { chordWidth } from "@/modules/chords/utils/chord.utils"
import { ArrowLeftRight, Trash } from "lucide-react"

type Props = {
  timeSignature: TimeSignature
  chord: BarChord
  dragStyle?: React.CSSProperties
  dragAttributes?: React.HTMLAttributes<HTMLDivElement>
  dragListeners?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
  onDelete?: React.MouseEventHandler<HTMLButtonElement>
}

export const Chord = forwardRef<HTMLDivElement, Props>(
  (
    {
      timeSignature,
      chord,
      dragStyle,
      dragAttributes,
      dragListeners,
      isDragging,
      onDelete,
    },
    ref
  ) => {
    const width = chordWidth(chord.duration, timeSignature.beatsPerMeasure)

    return (
      <div
        ref={ref}
        className="CHORD-WRAP relative group py-2 font-bold text-white text-xs"
        style={{
          width,
          visibility: isDragging ? "hidden" : "visible",
          ...(dragStyle ?? {}),
        }}
      >
        <div className="flex items-center justify-center">
          <span>{chord.name}</span>
        </div>

        <div
          className="
            flex flex-row
            justify-center
            items-center
            absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition"
        >
          <div
            {...dragAttributes}
            {...dragListeners}
            className="cursor-grab text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <button
            className="text-zinc-400 hover:text-zinc-200"
            type="button"
            onClick={onDelete}
            aria-label="Delete chord"
            title="Delete chord"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }
)

Chord.displayName = "Chord"
