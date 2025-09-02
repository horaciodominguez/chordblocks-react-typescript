import { useEffect, useState } from "react"

import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"

import { Toaster } from "sonner"

import type { Song } from "@/modules/songs/types/song.types"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from "@/pages/Home"
import ViewSong from "@/pages/ViewSong"
import NewSong from "@/pages/NewSong"
import EditSong from "@/pages/EditSong"

import { songsData } from "@/modules/songs/data/songs"

function App() {
  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    setSongs(songsData)
  }, [])

  return (
    <main
      className="
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
          <Route
            path="/new"
            element={<NewSong songs={songs} setSongs={setSongs} />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" theme="dark" />
      <Footer />
    </main>
  )
}

export default App
