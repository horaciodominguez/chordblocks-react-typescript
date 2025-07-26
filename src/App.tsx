import { useEffect, useState } from "react"
import { type Song } from "./types/song"
import { songsMock } from "./data/songsMock"
import { Header } from "./components/Header"
import { SongList } from "./components/SongList"
import { SongForm } from "./components/SongForm"
import { Footer } from "./components/Footer"


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
    <main className="bg-gray-900 text-gray-400 flex flex-col justify-center align-middle h-full">
      <Header />
      <SongList songs={songs} />
      <SongForm handleAddSong={handleAddSong} />
      <Footer />
    </main>
  )
}

export default App

