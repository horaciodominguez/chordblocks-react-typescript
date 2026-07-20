import { NavLink, useLocation } from "react-router-dom"
import { ListMusic, Library, Settings } from "lucide-react"

const navItems = [
  { to: "/", label: "Songs", icon: ListMusic, end: true },
  { to: "/repertoires", label: "Sets", icon: Library, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
]

export function BottomNav() {
  const location = useLocation()

  const hideOnEdit =
    location.pathname === "/new" ||
    /^\/song\/[^/]+\/edit$/.test(location.pathname) ||
    /^\/repertoires\/[^/]+\/edit$/.test(location.pathname)

  const playMode =
    new URLSearchParams(location.search).get("mode") === "play"

  if (hideOnEdit || playMode) return null

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30
        bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800
        pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <ul className="flex justify-around items-stretch max-w-3xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2 min-h-14
                   text-[10px] uppercase tracking-wide
                   ${isActive ? "text-indigo-300" : "text-zinc-500"}`
                }
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
