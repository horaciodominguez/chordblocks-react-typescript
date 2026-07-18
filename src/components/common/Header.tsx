import Nav from "./Nav"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"
import { User } from "lucide-react"
import { AppDialog } from "@/components/ui/AppDialog"
import { Link } from "react-router-dom"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-end relative p-2 md:p-4 pb-6 md:pb-8 mb-2 md:mb-4">
      <h1 className="text-gray-200 text-3xl uppercase">
        <Link to="/" aria-label="ChordBlocks home">
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

      <div className="hidden md:block">
        {user ? (
          <LogoutButton />
        ) : (
          <AppDialog
            trigger={
              <button
                type="button"
                aria-label="Login"
                className="flex flex-col justify-center items-center gap-0 cursor-pointer rounded-full bg-zinc-100/5 min-h-11 min-w-11 p-2"
              >
                <User className="text-indigo-700 w-6 h-6" />
                <span className="text-[10px] text-indigo-400 uppercase">
                  Login
                </span>
              </button>
            }
            title="Login"
            description="Enter your email to receive a login link"
          >
            <LoginForm />
          </AppDialog>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0" />
    </header>
  )
}
