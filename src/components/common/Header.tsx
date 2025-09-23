import Nav from "./Nav"

import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"
import { User } from "lucide-react"

import * as Dialog from "@radix-ui/react-dialog"

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
        <div className="">
          <div>
            {user ? (
              <LogoutButton />
            ) : (
              <>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="flex flex-col justify-center items-center gap-0 cursor-pointer rounded-full bg-zinc-100/5 w-10 h-10 p-8  ">
                      <div className="flex justify-center items-center">
                        <User className="text-indigo-700 mb-1 w-6 h-6" />
                      </div>
                      <div className="text-[10px] text-indigo-400 uppercase ">
                        Login
                      </div>
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80" />
                    <Dialog.Content
                      className="fixed 
                                top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 
                                z-50  rounded-md 
                                flex flex-col justify-start items-start gap-4 
                                p-[.1px] 
                                bg-gradient-to-br from-indigo-500/0 
                                to-indigo-900/5
                                hover:from-indigo-600/15
                                box-border
                                backdrop-blur-xs border-[.1px] border-indigo-600/30  shadow-xl"
                    >
                      <div className="rounded-md bg-zinc-900/10 backdrop-filter backdrop-blur-md p-6 w-full">
                        <Dialog.Title className="text-xl font-bold text-zinc-200 mb-2">
                          Login
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-zinc-400 mb-4">
                          Enter your email to receive a login link
                        </Dialog.Description>

                        <LoginForm />

                        <Dialog.Close asChild>
                          <button className="mt-4 text-sm text-gray-600">
                            Close
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </>
            )}
          </div>
        </div>
      </div>
      <Nav />
    </>
  )
}
