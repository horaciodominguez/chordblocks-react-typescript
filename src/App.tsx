
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { useEffect, useState } from "react"
import type { Song } from "./types/song"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ViewSong from "./pages/ViewSong"
import NewSong from "./pages/NewSong"
import EditSong from "./pages/EditSong"
import { songsMock } from "./data/songsMock"

function App() {

  const [songs, setSongs] = useState<Song[]>([])

  useEffect(()=>{
      setSongs(songsMock)
  }, [])

  return (

    <main className="
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-center align-middle 
      min-h-screen"
    >
      
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home songs={songs} />} />
          <Route path="/song/:id" element={<ViewSong songs={songs} />} />
          <Route path="/song/:id/edit" element={<EditSong />} />
          <Route path="/new" element={<NewSong  songs={songs} setSongs={setSongs} />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </main>
    )
}

export default App

