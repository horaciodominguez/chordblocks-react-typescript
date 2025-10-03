import { AppDialog } from "./AppDialog"
import * as Dialog from "@radix-ui/react-dialog"
import Button from "./Button"

type Props = {
  trigger: React.ReactNode
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmDialog({
  trigger,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: Props) {
  return (
    <AppDialog trigger={trigger} title={title} description={description}>
      <div className="flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button variant="cancel">{cancelLabel}</Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button onClick={onConfirm} variant="delete">
            {confirmLabel}
          </Button>
        </Dialog.Close>
      </div>
    </AppDialog>
  )
}
