import React, { forwardRef } from "react"
import type { BarChord, TimeSignature } from "@/modules/songs/types/song.types"
import { chordWidth } from "@/utils/widthByTS"

type Props = {
	timeSignature: TimeSignature,
	chord: BarChord,
	renderChord?: (chordId: string) => React.ReactNode,
	dragStyle?: React.CSSProperties,
	dragAttributes?: React.HTMLAttributes<HTMLDivElement>,
	dragListeners?: React.HTMLAttributes<HTMLDivElement>
}

export const Chord = forwardRef<HTMLDivElement, Props>(
  ({ timeSignature,  chord , renderChord, dragStyle, dragAttributes, dragListeners }, ref) => {

	const width = chordWidth(chord.duration, timeSignature.beatsPerMeasure)

	return (
		<div 
			ref={ref}
			className="py-2 px-4 font-bold text-white " 
			style={{ width, ...(dragStyle ?? {}) }} 
			{...dragAttributes}
      {...dragListeners}
		>
			{chord.name}
			{renderChord?.(chord.id)}
		</div>
	)
})