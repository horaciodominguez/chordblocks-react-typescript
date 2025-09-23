import { Footer } from "@/components/common/Footer"
import { Header } from "@/components/common/Header"
import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditSong from "@/pages/EditSong"
import Home from "@/pages/Home"
import NewSong from "@/pages/NewSong"
import ViewSong from "@/pages/ViewSong"
import { useSongs } from "./modules/songs/hooks/useSongs"

export default function App() {
  const { songs, setSongs, loading } = useSongs()
  if (loading) return <div>Loading songs...</div>
  return (
    <main
      className="
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-between
      min-h-screen"
    >
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home songs={songs} />} />
            <Route path="/song/:id" element={<ViewSong />} />
            <Route
              path="/song/:id/edit"
              element={<EditSong songs={songs} setSongs={setSongs} />}
            />
            <Route
              path="/new"
              element={<NewSong songs={songs} setSongs={setSongs} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
      <Toaster richColors position="top-center" theme="dark" />
      <Footer />
    </main>
  )
}
