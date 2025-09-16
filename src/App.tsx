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

import { storage } from "./services/storage"

function App() {
  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    async function init() {
      let dbSongs = await storage.getSongs()
      if (dbSongs.length === 0) {
        for (const song of songsData) {
          await storage.saveSong(song)
        }
        dbSongs = songsData
        console.log("loaded from mock data")
      } else {
        console.log("loaded from db")
      }
      setSongs(dbSongs)
    }

    init()
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
          <Route
            path="/song/:id/edit"
            element={<EditSong songs={songs} setSongs={setSongs} />}
          />
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
