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

function defaultAction(conflict: SongSyncConflict): ConflictAction {
  // Offline edit vs newer cloud: default to keeping this device's work visible as a choice
  if (
    conflict.source === "pending_vs_remote" &&
    conflict.songA.id === conflict.songB.id
  ) {
    return "keepLocal"
  }
  return "keepNewest"
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
      next[c.id] = defaultAction(c)
    }
    setActions(next)
  }, [conflicts])

  if (conflicts.length === 0) return null

  const hasSameIdLww = conflicts.some(
    (c) => c.source === "pending_vs_remote" && c.songA.id === c.songB.id,
  )

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 light:bg-zinc-900/40" />
        <Dialog.Content
          className="fixed z-50 focus:outline-none bg-zinc-900 shadow-xl p-4 sm:p-6 w-[calc(100vw-1.5rem)] max-w-lg max-h-[85dvh] overflow-y-auto scrollbar-app left-1/2 -translate-x-1/2 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 rounded-xl sm:rounded-md light:bg-white"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className="text-lg font-bold mb-2 text-white light:text-zinc-900">
            Song sync conflicts
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mb-4 light:text-zinc-600">
            {hasSameIdLww
              ? "An offline edit on this device conflicts with a newer version in the cloud. Choose which to keep — nothing is discarded until you apply."
              : "Same title and artist found on this device and in the cloud. Choose whether to keep the newest version, keep this device’s version, or keep both songs."}
          </Dialog.Description>

          <ul className="flex flex-col gap-3 mb-4">
            {conflicts.map((c) => {
              const action = actions[c.id] ?? defaultAction(c)
              const sameId = c.songA.id === c.songB.id
              return (
                <li
                  key={c.id}
                  className="border border-zinc-700 rounded-md p-3 light:border-zinc-200"
                >
                  <p className="text-sm text-zinc-100 font-medium light:text-zinc-900">
                    {c.songA.title}
                  </p>
                  <p className="text-xs text-zinc-500 mb-2 light:text-zinc-600">
                    {c.songA.artist}
                  </p>
                  <p className="text-xs text-zinc-400 mb-2 light:text-zinc-600">
                    This device: {formatDate(c.songA.updatedAt)}
                    <br />
                    Cloud: {formatDate(c.songB.updatedAt)}
                    {sameId ? (
                      <>
                        <br />
                        <span className="text-amber-400/90 light:text-amber-700">
                          Same song id — offline vs cloud versions
                        </span>
                      </>
                    ) : null}
                  </p>
                  <div className="flex flex-col gap-1.5 text-sm text-zinc-300 light:text-zinc-800">
                    {(
                      [
                        ["keepLocal", "Keep this device"],
                        ["keepNewest", "Keep newest"],
                        [
                          "keepBoth",
                          sameId
                            ? "Keep both (fork offline edit)"
                            : "Keep both",
                        ],
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
                    action: actions[c.id] ?? defaultAction(c),
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
