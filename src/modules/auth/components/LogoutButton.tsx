import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import { signOut } from "@/services/auth/supabaseAuth"
import { idbStorage } from "@/services/storage/providers/storage.idb"

type LogoutChoice = "keep" | "clear"

export function LogoutButton() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const finishSignOut = async (choice: LogoutChoice) => {
    if (busy) return
    setBusy(true)
    try {
      if (choice === "clear") {
        await idbStorage.clearAllLocalData()
      }
      await signOut()
      setOpen(false)
    } catch (err) {
      console.error("signOut error:", err)
      toast.error(
        choice === "clear"
          ? "Could not clear local data and sign out. Try again."
          : "Could not sign out. Try again.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (busy) return
        setOpen(next)
      }}
    >
      <Dialog.Trigger asChild>
        <Button
          variant="delete"
          className="flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 light:bg-zinc-900/40" />
        <Dialog.Content
          className="
            fixed z-50 focus:outline-none
            bg-zinc-900 shadow-xl p-4 sm:p-6
            light:bg-white light:border light:border-zinc-200
            w-[calc(100vw-1.5rem)] max-w-md
            max-h-[85dvh] overflow-y-auto scrollbar-app
            left-1/2 -translate-x-1/2
            bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2
            rounded-xl sm:rounded-md
          "
          onEscapeKeyDown={(e) => {
            if (busy) e.preventDefault()
          }}
          onPointerDownOutside={(e) => {
            if (busy) e.preventDefault()
          }}
        >
          <Dialog.Title className="text-lg font-bold mb-2 text-white light:text-zinc-900">
            Sign out
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mb-4 light:text-zinc-600">
            Keep songs and sets on this device for offline use, or clear them so
            the next person on this device cannot see your charts.
          </Dialog.Description>

          <div className="flex flex-col gap-2">
            <Button
              variant="save"
              disabled={busy}
              onClick={() => void finishSignOut("keep")}
              className="w-full"
            >
              {busy ? "Signing out…" : "Keep on this device"}
            </Button>
            <Button
              variant="delete"
              disabled={busy}
              onClick={() => void finishSignOut("clear")}
              className="w-full"
            >
              Clear this device and sign out
            </Button>
            <Dialog.Close asChild>
              <Button variant="cancel" disabled={busy} className="w-full">
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
