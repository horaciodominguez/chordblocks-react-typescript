import { SongForm } from "@/modules/songs/components/form/SongForm"
import type { Song } from "@/modules/songs/types/song.types"
import { storage } from "@/services/storage"
import { saveSongWithSync } from "@/services/sync/syncManager"

type Props = {
  songs: Song[]
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>
}

export default function NewSong({ setSongs }: Props) {
  const handleAddSong = async (song: Song) => {
    await storage.saveSong(song)

    await saveSongWithSync(song)

    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
  }

  return (
    <>
      <h2 className="page-title mb-4">Add Song</h2>
      <SongForm handleAddSong={handleAddSong} />
    </>
  )
}
