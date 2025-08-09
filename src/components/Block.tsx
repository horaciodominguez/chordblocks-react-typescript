import type { Chord, Song as SongType } from "../types/song"

type Props = {
    song: SongType,
    chord: Chord
}

export const Block = ({song, chord}: Props) => {
    return (
        <div
            className="bg-blue-950 flex items-center justify-center py-4 mb-2"
            style={{
                width: `${(chord.beats / (song.timeSignature.beatsPerMeasure * 4)) * 100}%` // 4 compases por bloque
            }}
            >
            {chord.name}
        </div>
    )
}