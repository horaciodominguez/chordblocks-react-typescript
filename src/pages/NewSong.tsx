import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { storage } from "@/services/storage"

type Props = {
  songs: Song[]
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function NewSong({ setSongs }: Props) {
  const handleAddSong = async (song: Song) => {
    await storage.saveSong(song)

    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  return (
    <>
      <h2 className="text-gray-300 font-bold text-center  ">New Song</h2>
      <SongForm handleAddSong={handleAddSong} />
    </>
  )
}
