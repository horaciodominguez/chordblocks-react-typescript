import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { useLocation } from "react-router-dom"
import { isPlayModeParam } from "@/modules/repertoires/utils/repertoire.navigation"
import { isEditPath } from "@/config/navigation"

type Props = {
  children: React.ReactNode
}

/**
 * Shell modes:
 * - default: Header + content + Footer + BottomNav (mobile)
 * - edit: Header + content (no Footer / BottomNav)
 * - play: content only (minimal atril chrome)
 */
export function AppShell({ children }: Props) {
  const location = useLocation()
  const editMode = isEditPath(location.pathname)
  const playMode = isPlayModeParam(
    new URLSearchParams(location.search).get("mode"),
  )

  if (playMode) {
    return (
      <main
        id="main-content"
        className="
          font-sans
          max-w-3xl mx-auto px-3 py-2
          flex flex-col
          min-h-screen
          pb-[calc(4rem+env(safe-area-inset-bottom))]
        "
      >
        <div className="flex-grow">{children}</div>
      </main>
    )
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-indigo-800 focus:px-3 focus:py-2 focus:text-sm focus:text-white light:focus:bg-indigo-600"
      >
        Skip to content
      </a>
      <main
        id="main-content"
        className="
          font-sans
          max-w-3xl mx-auto px-4 py-4 md:py-8
          flex flex-col justify-between
          min-h-screen
          pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8
        "
      >
        <Header />
        <div className="flex-grow">{children}</div>
        {!editMode && <Footer />}
        <BottomNav />
      </main>
    </>
  )
}
