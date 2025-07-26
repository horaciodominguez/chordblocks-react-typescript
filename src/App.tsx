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
    <main className="
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-center align-middle 
      min-h-screen"
    >
      <Header />
      <SongList songs={songs} />
      <SongForm handleAddSong={handleAddSong} />
      <Footer />
    </main>
  )
}

export default App

