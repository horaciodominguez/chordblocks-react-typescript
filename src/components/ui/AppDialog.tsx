import { useId } from "react"
import * as Dialog from "@radix-ui/react-dialog"

type AppDialogProps = {
  /** Omit when using controlled `open` without a visible trigger. */
  trigger?: React.ReactNode
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AppDialog({
  trigger,
  title,
  description,
  children,
  className = "",
  open,
  onOpenChange,
}: AppDialogProps) {
  const descriptionId = useId()
  const controlled = open !== undefined && onOpenChange !== undefined

  return (
    <Dialog.Root {...(controlled ? { open, onOpenChange } : {})}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 light:bg-zinc-900/40" />
        <Dialog.Content
          aria-describedby={descriptionId}
          className={`
            fixed z-50 focus:outline-none
            bg-zinc-900 shadow-xl p-4 sm:p-6
            light:bg-white light:border light:border-zinc-200
            w-[calc(100vw-1.5rem)] max-w-lg
            max-h-[85dvh] overflow-y-auto scrollbar-app
            left-1/2 -translate-x-1/2
            bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2
            rounded-xl sm:rounded-md
            ${className}
          `}
        >
          {title && (
            <Dialog.Title className="text-lg font-bold mb-2 text-white light:text-zinc-900">
              {title}
            </Dialog.Title>
          )}
          <Dialog.Description
            id={descriptionId}
            className={
              description
                ? "text-sm text-zinc-400 mb-4 light:text-zinc-600"
                : "sr-only"
            }
          >
            {description ?? title ?? "Dialog"}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
