import React, { forwardRef } from "react"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import { chordWidth } from "@/utils/widthByTS"
import type { BarChord } from "@/modules/songs/types/bar.types"

type Props = {
  timeSignature: TimeSignature
  chord: BarChord
  renderChord?: (chordId: string) => React.ReactNode
  dragStyle?: React.CSSProperties
  dragAttributes?: React.HTMLAttributes<HTMLDivElement>
  dragListeners?: React.HTMLAttributes<HTMLDivElement>
}

export const Chord = forwardRef<HTMLDivElement, Props>(
  (
    {
      timeSignature,
      chord,
      renderChord,
      dragStyle,
      dragAttributes,
      dragListeners,
    },
    ref
  ) => {
    const width = chordWidth(chord.duration, timeSignature.beatsPerMeasure)

    return (
      <div
        ref={ref}
        className="flex py-2 px-4 font-bold text-white "
        style={{ width, ...(dragStyle ?? {}) }}
        {...dragAttributes}
        {...dragListeners}
      >
        <span>{chord.name}</span>
        {renderChord?.(chord.id)}
      </div>
    )
  }
)
