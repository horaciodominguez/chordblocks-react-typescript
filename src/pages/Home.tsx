
import { SongList } from "@/modules/songs/components/SongList"
import type { Song } from "@/modules/songs/types/song.types"

type Props = {
    songs: Song[]
}

export default function Home({ songs }: Props) {
    return (
        <>
            <h2 className="text-gray-300 font-bold text-center  ">Song List</h2>
            <SongList songs={songs} />
        </>
    )
}