import { useEffect, useState } from "react"
import { type Song } from "./types/song"
import { songsMock } from "./data/songsMock"
import { SongList } from "./components/SongList"
import { SongForm } from "./components/SongForm"


function App() {

  const [songs, setSongs] = useState<Song[]>([])
  
  useEffect(()=>{
    setSongs(songsMock)
  }, [])

  const handleAddSong = (song: Song) => {
    const newSongs = 
        [...songs,
        song]
    setSongs(newSongs)
  }

  return (
    <>
      <h1 className="text-amber-200">SongBlocks</h1>
      <SongList songs={songs} />
      <SongForm handleAddSong={handleAddSong} />
    </>
  )
}

export default App
