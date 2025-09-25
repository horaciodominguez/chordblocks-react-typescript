import { SongForm } from "@/modules/songs/components/form/SongForm"
import { useSong } from "@/modules/songs/hooks/useSong"
import type { Song } from "@/modules/songs/types/song.types"

import { useParams, useNavigate } from "react-router-dom"

import { useSongs } from "@/modules/songs/hooks/useSongs"

export default function EditSong() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()

  if (loading) return <div>Loading...</div>
  if (!song) return <div>Song not found</div>

  /* const handleUpdate = async (updated: Song) => {
    await saveSongWithSync(updated)
    const dbSongs = await storage.getSongs()
    setSongs(dbSongs)
    navigate(`/song/${updated.id}`)
  } */

  const handleSubmit = async (song: Song) => {
    if (!song) return
    await updateSong(song)
    navigate("/")
  }

  return (
    <>
      <h2 className="page-title mb-4">Edit Song</h2>
      <SongForm handleAddSong={handleSubmit} initialSong={song} />
    </>
  )
}
