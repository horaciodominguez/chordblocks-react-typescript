import React, { forwardRef } from "react"
import type { BarChord, TimeSignature } from "@/modules/songs/types/song.types"

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

	const width = `${(chord.duration / timeSignature.beatsPerMeasure) * 100}%`
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