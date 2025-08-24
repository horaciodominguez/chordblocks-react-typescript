import type { BarChord, TimeSignature } from "@/modules/songs/types/song.types"

type Props = {
	timeSignature: TimeSignature,
	chord: BarChord,
	renderChord?: (chordId: string) => React.ReactNode
}

export const Chord = ({timeSignature, chord, renderChord}: Props) => {
	const width = `${(chord.duration / timeSignature.beatsPerMeasure) * 100}%`
	return (
		<div className="py-2 px-4 font-bold text-white " style={{width}} key={chord.id}>
			{chord.name}
			{renderChord && renderChord(chord.id)}
		</div>
	)
}