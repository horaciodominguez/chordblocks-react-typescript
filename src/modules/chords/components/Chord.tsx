import type { BarChord, TimeSignature } from "@/modules/songs/types/song.types"

type Props = {
    timeSignature: TimeSignature,
    chord: BarChord
}

export const Chord = ({timeSignature, chord}: Props) => {
    
    const width = `${(chord.duration / timeSignature.beatsPerMeasure) * 100}%`
    return (
        <div className="py-2 px-4 font-bold text-white " style={{width}} key={chord.id}>
            {chord.name}
        </div>
    )
    
}