import * as Dialog from "@radix-ui/react-dialog"
import Button from "./Button"

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
              <Button variant="cancel">{cancelLabel}</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button
                onClick={async () => {
                  await onConfirm()
                }}
                variant="delete"
              >
                {confirmLabel}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
