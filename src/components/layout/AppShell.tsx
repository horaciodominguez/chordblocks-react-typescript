import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { useLocation } from "react-router-dom"
import { isPlayModeParam } from "@/modules/repertoires/utils/repertoire.navigation"

type Props = {
  children: React.ReactNode
}

export function AppShell({ children }: Props) {
  const location = useLocation()
  const isEditRoute =
    location.pathname === "/new" ||
    /^\/song\/[^/]+\/edit$/.test(location.pathname) ||
    /^\/repertoires\/[^/]+\/edit$/.test(location.pathname)

  const playMode = isPlayModeParam(
    new URLSearchParams(location.search).get("mode"),
  )

  if (playMode) {
    return (
      <main
        className="
          maincontainer
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
    <main
      className="
        maincontainer
        max-w-3xl mx-auto px-4 py-4 md:py-8
        flex flex-col justify-between
        min-h-screen
        pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8
      "
    >
      <Header />
      <div className="flex-grow">{children}</div>
      {!isEditRoute && <Footer />}
      <BottomNav />
    </main>
  )
}
