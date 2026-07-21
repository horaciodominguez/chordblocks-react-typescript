import { useId } from "react"
import * as Dialog from "@radix-ui/react-dialog"

type AppDialogProps = {
  trigger: React.ReactNode
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function AppDialog({
  trigger,
  title,
  description,
  children,
  className = "",
}: AppDialogProps) {
  const descriptionId = useId()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content
          aria-describedby={description ? descriptionId : undefined}
          className={`
            fixed z-50 focus:outline-none
            bg-zinc-900 shadow-xl p-4 sm:p-6
            w-[calc(100vw-1.5rem)] max-w-lg
            max-h-[85dvh] overflow-y-auto
            left-1/2 -translate-x-1/2
            bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2
            rounded-xl sm:rounded-md
            ${className}
          `}
        >
          {title && (
            <Dialog.Title className="text-lg font-bold mb-2 text-white">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description
              id={descriptionId}
              className="text-sm text-zinc-400 mb-4"
            >
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
