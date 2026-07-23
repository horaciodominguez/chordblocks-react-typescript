import * as Dialog from "@radix-ui/react-dialog"
import Button from "@/components/ui/Button"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

type Props = {
  songs: Song[]
  repertoires: Repertoire[]
  open: boolean
  applying?: boolean
  onResolve: (action: "delete" | "keep") => void
}

export function SyncOrphanDialog({
  songs,
  repertoires,
  open,
  applying = false,
  onResolve,
}: Props) {
  const hasItems = songs.length > 0 || repertoires.length > 0
  if (!hasItems) return null

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 light:bg-zinc-900/40" />
        <Dialog.Content
          className="fixed z-50 focus:outline-none bg-zinc-900 shadow-xl p-4 sm:p-6 w-[calc(100vw-1.5rem)] max-w-lg max-h-[85dvh] overflow-y-auto scrollbar-app left-1/2 -translate-x-1/2 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 rounded-xl sm:rounded-md light:bg-white light:border light:border-zinc-200"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className="text-lg font-bold mb-2 text-white light:text-zinc-900">
            Local-only items found
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mb-4 light:text-zinc-600">
            These songs or sets exist on this device but not in the cloud.
            Nothing will be deleted until you choose.{" "}
            <strong className="text-zinc-200 font-medium light:text-zinc-800">
              Delete
            </strong>{" "}
            removes them from this device (and removes those songs from any
            sets).{" "}
            <strong className="text-zinc-200 font-medium light:text-zinc-800">
              Keep &amp; upload
            </strong>{" "}
            queues them to sync to your account.
          </Dialog.Description>

          {songs.length > 0 ? (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2 light:text-zinc-600">
                Songs ({songs.length})
              </p>
              <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto scrollbar-app">
                {songs.map((s) => (
                  <li
                    key={s.id}
                    className="text-sm text-zinc-200 border border-zinc-700 rounded-md px-3 py-2 light:text-zinc-900 light:border-zinc-200"
                  >
                    <span className="font-medium">{s.title}</span>
                    <span className="text-zinc-500 light:text-zinc-600">
                      {" "}
                      · {s.artist}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {repertoires.length > 0 ? (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2 light:text-zinc-600">
                Sets ({repertoires.length})
              </p>
              <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto scrollbar-app">
                {repertoires.map((r) => (
                  <li
                    key={r.id}
                    className="text-sm text-zinc-200 border border-zinc-700 rounded-md px-3 py-2 light:text-zinc-900 light:border-zinc-200"
                  >
                    {r.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="delete"
              disabled={applying}
              onClick={() => onResolve("delete")}
              className="w-full sm:w-auto"
            >
              {applying ? "Working…" : "Delete from this device"}
            </Button>
            <Button
              variant="save"
              disabled={applying}
              onClick={() => onResolve("keep")}
              className="w-full sm:w-auto"
            >
              {applying ? "Working…" : "Keep & upload"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
