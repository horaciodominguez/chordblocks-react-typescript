import { SongList } from "@/modules/songs/components/SongList"
import type { Song } from "@/modules/songs/types/song.types"

type Props = {
  songs: Song[]
}

export default function Home({ songs }: Props) {
  return (
    <>
      <h2 className="page-title mb-4">Song List</h2>
      <SongList songs={songs} />
    </>
  )
}
