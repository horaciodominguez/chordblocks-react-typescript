import Nav from "./Nav"

import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"
import { User } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <>
      <div
        className="flex justify-between items-center 
                    p-4 
                    g-indigo-950/20 border-[.1px] border-indigo-200/10 
                    rounded-md
                    mb-4"
      >
        <h1 className="text-gray-200 text-3xl uppercase text-center ">
          <figure>
            <img
              src="/assets/logo.svg"
              alt="ChordBlocks logo"
              className="mx-auto"
              width={120}
            />
          </figure>
        </h1>
        <div>
          {user ? (
            <div className="flex gap-4 justify-center items-center">
              <div className="flex flex-col justify-center items-center text-indigo-500 text-xs">
                <div>
                  <User size={16} />
                </div>
                <div>{user.email}</div>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
      <Nav />
    </>
  )
}
