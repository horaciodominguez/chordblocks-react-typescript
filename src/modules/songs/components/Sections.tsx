import { Chord } from "@/modules/chords/components/Chord"
import type { TimeSignature } from "../types/song.types"
import { barWidthByTS } from "@/utils/widthByTS"
import type { SongSection } from "../types/section.types"


type Props = {
	section: SongSection,
	timeSignature: TimeSignature,
	renderChord?: (chordId: string) => React.ReactNode
}

export const Sections = ({section, timeSignature, renderChord}: Props) => {
	return (
		<div className="flex flex-wrap divide-x-2 divide-blue-300 mb-4">
		{ 
			//POR CADA COMPAS
			section.bars.map(
				bar => {
					const width = barWidthByTS(timeSignature.beatsPerMeasure)
					return (
						//CONTENEDOR DE COMPAS
						<div style={{width}} key={bar.id} className="flex divide-x-1 divide-blue-900 mb-4">
							{
								bar.chords.map(
									chord => <Chord key={chord.id} chord={chord} timeSignature={timeSignature} renderChord={renderChord} />
								)
							}
						</div>
					)
				}
			)
		}
		</div>
	)
}