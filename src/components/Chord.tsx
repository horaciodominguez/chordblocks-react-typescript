import type { SongChord as SongChord, TimeSignature } from "../types/song.types"

type Props = {
    //song: SongType,
    timeSignature: TimeSignature,
    chord: SongChord
}

export const Chord = ({timeSignature, chord}: Props) => {
    return (
        <div
            className="bg-blue-950 flex items-center justify-center py-4 mb-2"
            style={{
                width: `${(chord.beats / (timeSignature.beatsPerMeasure * timeSignature.noteValue)) * 100}%` // 4 compases por bloque
            }}
            >
            {chord.name}
        </div>
    )
}