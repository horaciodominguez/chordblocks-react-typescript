import { Footer } from "@/components/common/Footer"
import { Header } from "@/components/common/Header"
import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditSong from "@/pages/EditSong"
import Home from "@/pages/Home"
import NewSong from "@/pages/NewSong"
import ViewSong from "@/pages/ViewSong"
import { useSongs } from "./modules/songs/hooks/useSongs"
import LoaderSpinner from "./components/ui/LoaderSpinner"
import UITest from "./pages/UITest"
import { useRef } from "react"

export default function App() {
  const count = useRef(0)
  count.current += 1
  console.log("App component rendered", count.current, "times")
  const { loading } = useSongs()
  if (loading)
    return (
      <main
        className="
        maincontainer
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-center
      items-center
      min-h-screen
      h-full"
      >
        <LoaderSpinner />
      </main>
    )
  return (
    <main
      className="
      maincontainer
      max-w-3xl mx-auto px-4 py-8
      flex flex-col justify-between
      min-h-screen"
    >
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/song/:id" element={<ViewSong />} />
            <Route path="/song/:id/edit" element={<EditSong />} />
            <Route path="/new" element={<NewSong />} />
            <Route path="/uitest" element={<UITest />} />
          </Routes>
        </div>
      </BrowserRouter>
      <Toaster richColors position="top-center" theme="dark" />
      <Footer />
    </main>
  )
}
