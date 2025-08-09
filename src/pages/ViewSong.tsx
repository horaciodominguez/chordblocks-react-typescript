import { Song } from "../components/Song";
import type { Song as SongType } from "../types/song";
import { useParams } from "react-router-dom";


type Props = {
    songs: SongType[]
}

export default function ViewSong ({songs}: Props) {
    
    const { id } = useParams<{ id: string }>()
    const song = songs.find(s => s.id === id)

    if (!song) {
        return <div>Canción no encontrada</div>
    }

    return (
        <>
            <h2>View Song</h2>
            <Song song={song} />
        </>
    )
}