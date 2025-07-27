/*
import { SongList } from "./components/SongList"
import { SongForm } from "./components/SongForm"

function App() {

  const handleAddSong = (song: Song) => {
      const newSongs = 
          [...songs,
          song]
      setSongs(newSongs)
  }

  return (
    
      
      <SongForm handleAddSong={handleAddSong} />
      
  )
}*/

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ViewSong from "./pages/ViewSong"
import NewSong from "./pages/NewSong"
import EditSong from "./pages/EditSong"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"

function App() {
  return (
    <main className="
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-center align-middle 
      min-h-screen"
    >
      <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/song/:id" element={<ViewSong />} />
            <Route path="/song/:id/edit" element={<EditSong />} />
            <Route path="/new" element={<NewSong />} />
          </Routes>
        </BrowserRouter>
      <Footer />
    </main>
    )
}

export default App

