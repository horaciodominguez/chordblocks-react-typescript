import Nav from "./Nav"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"
import { SyncStatusIndicator } from "@/modules/auth/components/SyncStatusIndicator"
import { User } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/navigation"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-end relative p-2 md:p-4 pb-6 md:pb-8 mb-2 md:mb-4">
      <h1 className="text-zinc-200 text-3xl uppercase light:text-zinc-800">
        <Link to={ROUTES.home} aria-label="ChordBlocks home">
          <figure>
            <img
              src="/assets/logo.svg"
              alt="ChordBlocks logo"
              className="mx-auto w-20 md:w-[120px]"
              width={120}
            />
          </figure>
        </Link>
      </h1>

      <Nav />

      <div className="flex flex-col items-end gap-0.5">
        <SyncStatusIndicator variant="chip" />
        {user ? (
          <div className="hidden md:block">
            <LogoutButton />
          </div>
        ) : (
          <Link
            to={ROUTES.settingsAccount}
            aria-label="Sign in"
            className="flex flex-col justify-center items-center gap-0 cursor-pointer rounded-full bg-zinc-100/5 min-h-11 min-w-11 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:bg-indigo-50 light:border light:border-indigo-100"
          >
            <User className="text-indigo-700 w-6 h-6 light:text-indigo-600" />
            <span className="text-[10px] text-indigo-400 uppercase light:text-indigo-600">
              Sign in
            </span>
          </Link>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0 light:via-indigo-400/50" />
    </header>
  )
}
