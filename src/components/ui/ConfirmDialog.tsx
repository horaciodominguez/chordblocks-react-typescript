import * as Dialog from "@radix-ui/react-dialog"

type Props = {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => Promise<void> | void
  trigger: React.ReactNode
}

export function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  trigger,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-gray-800 text-white rounded-md p-6 shadow-xl w-80"
        >
          <Dialog.Title className="text-sm font-bold mb-4">
            {title}
          </Dialog.Title>
          {description && <p className="mb-6 text-sm">{description}</p>}
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-3 py-1 text-sm rounded bg-gray-600 hover:bg-gray-700">
                {cancelLabel}
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={async () => {
                  await onConfirm()
                }}
                className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700"
              >
                {confirmLabel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
