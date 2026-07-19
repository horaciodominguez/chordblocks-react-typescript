import { NavLink, useLocation } from "react-router-dom"
import { ListMusic, ListPlus, Library, User, LogOut } from "lucide-react"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { AppDialog } from "@/components/ui/AppDialog"
import { signOut } from "@/services/auth/supabaseAuth"

const navItems = [
  { to: "/", label: "Songs", icon: ListMusic, end: true },
  { to: "/repertoires", label: "Sets", icon: Library, end: false },
  { to: "/new", label: "Add", icon: ListPlus, end: false },
]

export function BottomNav() {
  const { user } = useAuth()
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

        <li className="flex-1">
          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              aria-label="Sign out"
              className="flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 w-full
                         text-[10px] uppercase tracking-wide text-zinc-500 hover:text-indigo-300"
            >
              <LogOut size={22} />
              <span>Account</span>
            </button>
          ) : (
            <AppDialog
              trigger={
                <button
                  type="button"
                  aria-label="Login"
                  className="flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 w-full
                             text-[10px] uppercase tracking-wide text-zinc-500 hover:text-indigo-300"
                >
                  <User size={22} />
                  <span>Account</span>
                </button>
              }
              title="Login"
              description="Enter your email to receive a login link"
            >
              <LoginForm />
            </AppDialog>
          )}
        </li>
      </ul>
    </nav>
  )
}
