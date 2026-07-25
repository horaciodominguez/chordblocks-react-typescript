import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useSongs } from "./modules/songs/hooks/useSongs"
import { useRepertoires } from "./modules/repertoires/hooks/useRepertoires"
import LoaderSpinner from "./components/ui/LoaderSpinner"
import { AppShell } from "./components/layout/AppShell"
import { RouteSuspense } from "./components/layout/RouteSuspense"
import { useTheme } from "./modules/ui/hooks/useTheme"
import { lazyWithRetry } from "./utils/lazyWithRetry"

const Home = lazyWithRetry(() => import("@/pages/Home"))
const Songs = lazyWithRetry(() => import("@/pages/Songs"))
const ViewSong = lazyWithRetry(() => import("@/pages/ViewSong"))
const EditSong = lazyWithRetry(() => import("@/pages/EditSong"))
const NewSong = lazyWithRetry(() => import("@/pages/NewSong"))
const Repertoires = lazyWithRetry(() => import("@/pages/Repertoires"))
const ViewRepertoire = lazyWithRetry(() => import("@/pages/ViewRepertoire"))
const EditRepertoire = lazyWithRetry(() => import("@/pages/EditRepertoire"))
const Settings = lazyWithRetry(() => import("@/pages/Settings"))
const NotFound = lazyWithRetry(() => import("@/pages/NotFound"))
const UITest = import.meta.env.DEV
  ? lazyWithRetry(() => import("@/pages/UITest"))
  : null

export default function App() {
  const { initialLoading: songsLoading } = useSongs()
  const { initialLoading: setsLoading } = useRepertoires()
  const { sonnerTheme } = useTheme()
  const initialLoading = songsLoading || setsLoading

  if (initialLoading) {
    return (
      <main
        className="
        font-sans
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
        <RouteSuspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/song/:id" element={<ViewSong />} />
            <Route path="/song/:id/edit" element={<EditSong />} />
            <Route path="/new" element={<NewSong />} />
            <Route path="/repertoires" element={<Repertoires />} />
            <Route path="/repertoires/:id" element={<ViewRepertoire />} />
            <Route path="/repertoires/:id/edit" element={<EditRepertoire />} />
            <Route path="/settings" element={<Settings />} />
            {UITest ? <Route path="/uitest" element={<UITest />} /> : null}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteSuspense>
      </AppShell>
      <Toaster richColors position="top-center" theme={sonnerTheme} />
    </BrowserRouter>
  )
}
