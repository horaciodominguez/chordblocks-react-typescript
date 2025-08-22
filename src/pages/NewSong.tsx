import { SongForm2 } from "@/modules/songs/components/SongForm2"
import type { Song } from "@/modules/songs/types/song.types"

type Props = {
    songs: Song[],
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function NewSong ({ songs, setSongs }: Props) {

    const handleAddSong = (song: Song) => {
        const newSongs = [...songs,song]
        setSongs(newSongs)
    }

    return (
        <>
            <h2>New Song</h2>
            <SongForm2 handleAddSong={handleAddSong} />
        </>
    )
}