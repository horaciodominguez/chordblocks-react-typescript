import { NavLink, useLocation } from "react-router-dom"
import { NAV_ITEMS, isEditPath, isNavItemActive } from "@/config/navigation"
import { isPlayModeParam } from "@/modules/repertoires/utils/repertoire.navigation"

export function BottomNav() {
  const location = useLocation()

  const playMode = isPlayModeParam(
    new URLSearchParams(location.search).get("mode"),
  )

  if (isEditPath(location.pathname) || playMode) return null

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30
        bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800
        pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <ul className="flex justify-around items-stretch max-w-3xl mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isNavItemActive(item, location.pathname)
          return (
            <li key={item.id} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-14
                   text-[10px] uppercase tracking-wide
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                   ${active ? "text-indigo-300" : "text-zinc-500"}`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
