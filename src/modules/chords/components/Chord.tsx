import type { BarChord, TimeSignature } from "@/modules/songs/types/song.types"

type Props = {
    timeSignature: TimeSignature,
    chord: BarChord
}

export const Chord = ({timeSignature, chord}: Props) => {
    
    const width = `${(chord.duration / timeSignature.beatsPerMeasure) * 100}%`
    return (
        <div style={{width}} key={chord.id} className="border-2 border-green-400">
            <small>d: {chord.duration}</small>
            <small>w: {width}</small>
            <p>{chord.name}</p>
        </div>
    )
    
}