import Button from "@/components/ui/Button"

type Props = {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
}: Props) {
  return (
    <div className="text-center py-12 px-4">
      {icon ? (
        <div className="mx-auto mb-4 flex justify-center text-zinc-600 light:text-zinc-400">
          {icon}
        </div>
      ) : null}
      <p className="mb-2 text-lg text-zinc-200 light:text-zinc-900">{title}</p>
      {description ? (
        <p className="mb-6 text-sm text-zinc-500 max-w-md mx-auto light:text-zinc-600">
          {description}
        </p>
      ) : null}
      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button
          type="button"
          variant="save"
          className="min-h-11 inline-flex items-center gap-2 mx-auto"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default EmptyState
