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
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10" />
        <Dialog.Content
          aria-describedby={description}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      bg-zinc-900 rounded-md shadow-xl p-6 w-96 max-w-full
                      focus:outline-none 
                      z-10
                      ${className}`}
        >
          {title && (
            <Dialog.Title className="text-lg font-bold mb-2 text-white">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-sm text-gray-400 mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
