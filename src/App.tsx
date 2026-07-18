import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditSong from "@/pages/EditSong"
import Home from "@/pages/Home"
import NewSong from "@/pages/NewSong"
import ViewSong from "@/pages/ViewSong"
import { useSongs } from "./modules/songs/hooks/useSongs"
import LoaderSpinner from "./components/ui/LoaderSpinner"
import { AppShell } from "./components/layout/AppShell"
import { lazy, Suspense } from "react"

const UITest = import.meta.env.DEV
  ? lazy(() => import("@/pages/UITest"))
  : null

export default function App() {
  const { initialLoading } = useSongs()

  if (initialLoading) {
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
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/song/:id" element={<ViewSong />} />
          <Route path="/song/:id/edit" element={<EditSong />} />
          <Route path="/new" element={<NewSong />} />
          {UITest && (
            <Route
              path="/uitest"
              element={
                <Suspense fallback={<LoaderSpinner />}>
                  <UITest />
                </Suspense>
              }
            />
          )}
        </Routes>
      </AppShell>
      <Toaster richColors position="top-center" theme="dark" />
    </BrowserRouter>
  )
}
