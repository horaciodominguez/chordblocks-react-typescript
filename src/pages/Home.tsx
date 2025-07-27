
import { SongList } from "../components/SongList"
import type { Song } from "../types/song"

type Props = {
    songs: Song[]
}

export default function Home({ songs }: Props) {
    return (
        <>
            <h2>Home</h2>
            <SongList songs={songs} />
        </>
    )
}