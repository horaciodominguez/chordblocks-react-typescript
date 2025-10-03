import Nav from "./Nav"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"
import { User } from "lucide-react"
import { AppDialog } from "@/components/ui/AppDialog"

export function Header() {
  const { user } = useAuth()

  return (
    <header
      className="flex justify-between items-end relative
                 p-4 pb-8 
                 mb-4"
    >
      <h1 className="text-gray-200 text-3xl uppercase text-center">
        <figure>
          <img
            src="/assets/logo.svg"
            alt="ChordBlocks logo"
            className="mx-auto"
            width={120}
          />
        </figure>
      </h1>

      <Nav />

      <div>
        {user ? (
          <LogoutButton />
        ) : (
          <AppDialog
            trigger={
              <button className="flex flex-col justify-center items-center gap-0 cursor-pointer rounded-full bg-zinc-100/5 w-10 h-10 p-8">
                <div className="flex justify-center items-center">
                  <User className="text-indigo-700 mb-1 w-6 h-6" />
                </div>
                <div className="text-[10px] text-indigo-400 uppercase">
                  Login
                </div>
              </button>
            }
            title="Login"
            description="Enter your email to receive a login link"
          >
            <LoginForm />
          </AppDialog>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0"></div>
    </header>
  )
}
