import { SongForm } from "@/modules/songs/components/SongForm"
import type { Song } from "@/modules/songs/types/song.types"

type Props = {
  songs: Song[],
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function NewSong ({ songs, setSongs }: Props) {

  const handleAddSong = (song: Song) => {
    const newSongs = [...songs, song]
    setSongs(newSongs)
  }

  return (
    <>
      <h2>New Song</h2>
      <SongForm handleAddSong={handleAddSong} />
    </>
  )
}