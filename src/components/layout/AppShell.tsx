import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { useLocation } from "react-router-dom"
import { isPlayModeParam } from "@/modules/repertoires/utils/repertoire.navigation"
import { isEditPath } from "@/config/navigation"

type Props = {
  children: React.ReactNode
}

/** Song view with set prev/next chrome (`SetSongNav`) — fixed bar above BottomNav. */
function hasSetSongNav(pathname: string, search: string): boolean {
  if (!/^\/song\/[^/]+$/.test(pathname)) return false
  const params = new URLSearchParams(search)
  return Boolean(params.get("repertoireId") && params.get("itemId"))
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
  const setSongNav = hasSetSongNav(location.pathname, location.search)

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

  // BottomNav (~3.5rem) + optional SetSongNav (~3.75rem) + safe area
  const mainPaddingBottom = setSongNav
    ? "pb-[calc(8.25rem+env(safe-area-inset-bottom))] md:pb-[5.5rem]"
    : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8"

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
        className={`
          font-sans
          max-w-3xl mx-auto px-4 py-4 md:py-8
          flex flex-col justify-between
          min-h-screen
          ${mainPaddingBottom}
        `}
      >
        <Header />
        <div className="flex-grow">{children}</div>
        {/* Footer would sit under fixed SetSongNav — skip it in set song context */}
        {!editMode && !setSongNav && <Footer />}
        <BottomNav />
      </main>
    </>
  )
}
