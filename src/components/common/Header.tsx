import Nav from "./Nav"

import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"

export function Header() {
  const { user } = useAuth()

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-indigo-950/20 border-[.1px] border-indigo-200/10 rounded-md ">
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
              <span className="text-indigo-500 text-xs">{user.email}</span>
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
