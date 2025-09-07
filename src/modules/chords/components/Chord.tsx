import React, { forwardRef } from "react"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import type { BarChord } from "@/modules/songs/types/bar.types"
import { chordWidth } from "@/utils/widthByTS"

type Props = {
  timeSignature: TimeSignature
  chord: BarChord
  chordActions?: (chordId: string) => React.ReactNode
  dragStyle?: React.CSSProperties
  dragAttributes?: React.HTMLAttributes<HTMLDivElement>
  dragListeners?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

export const Chord = forwardRef<HTMLDivElement, Props>(
  (
    {
      timeSignature,
      chord,
      chordActions,
      dragStyle,
      dragAttributes,
      dragListeners,
      isDragging,
    },
    ref
  ) => {
    const width = chordWidth(chord.duration, timeSignature.beatsPerMeasure)

    return (
      <div
        ref={ref}
        className="flex items-center py-2 px-2 font-bold text-white bg-blue-500 rounded text-sm"
        style={{
          width,
          visibility: isDragging ? "hidden" : "visible",
          ...(dragStyle ?? {}),
        }}
      >
        <div
          {...dragAttributes}
          {...dragListeners}
          className="mr-2 cursor-grab select-none"
        >
          ⠿
        </div>
        <span className="flex-1">{chord.name}</span>
        {chordActions?.(chord.id)}
      </div>
    )
  }
)

Chord.displayName = "Chord"
