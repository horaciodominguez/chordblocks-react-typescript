import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import Button from "@/components/ui/Button"
import type {
  ConflictAction,
  SongSyncConflict,
  SongSyncConflictResolution,
} from "@/services/sync/contentIdentity"

type Props = {
  conflicts: SongSyncConflict[]
  open: boolean
  applying?: boolean
  onApply: (resolutions: SongSyncConflictResolution[]) => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function SongSyncConflictDialog({
  conflicts,
  open,
  applying = false,
  onApply,
}: Props) {
  const [actions, setActions] = useState<Record<string, ConflictAction>>({})

  useEffect(() => {
    const next: Record<string, ConflictAction> = {}
    for (const c of conflicts) {
      next[c.id] = "keepNewest"
    }
    setActions(next)
  }, [conflicts])

  if (conflicts.length === 0) return null

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed z-50 focus:outline-none bg-zinc-900 shadow-xl p-4 sm:p-6 w-[calc(100vw-1.5rem)] max-w-lg max-h-[85dvh] overflow-y-auto scrollbar-app left-1/2 -translate-x-1/2 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 rounded-xl sm:rounded-md"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className="text-lg font-bold mb-2 text-white">
            Song sync conflicts
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mb-4">
            Same title and artist found on this device and in the cloud. Choose
            whether to keep the newest version or keep both songs.
          </Dialog.Description>

          <ul className="flex flex-col gap-3 mb-4">
            {conflicts.map((c) => {
              const action = actions[c.id] ?? "keepNewest"
              return (
                <li
                  key={c.id}
                  className="border border-zinc-700 rounded-md p-3"
                >
                  <p className="text-sm text-zinc-100 font-medium">
                    {c.songA.title}
                  </p>
                  <p className="text-xs text-zinc-500 mb-2">{c.songA.artist}</p>
                  <p className="text-xs text-zinc-400 mb-2">
                    A: {formatDate(c.songA.updatedAt)}
                    <br />
                    B: {formatDate(c.songB.updatedAt)}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
                    {(
                      [
                        ["keepNewest", "Keep newest"],
                        ["keepBoth", "Keep both"],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className="inline-flex items-center gap-1.5 min-h-9 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`sync-conflict-${c.id}`}
                          checked={action === value}
                          disabled={applying}
                          onChange={() =>
                            setActions((prev) => ({ ...prev, [c.id]: value }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="flex justify-end">
            <Button
              variant="save"
              disabled={applying}
              onClick={() =>
                onApply(
                  conflicts.map((c) => ({
                    conflictId: c.id,
                    action: actions[c.id] ?? "keepNewest",
                  })),
                )
              }
            >
              {applying ? "Applying…" : "Apply"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
