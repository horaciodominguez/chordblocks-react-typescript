type Props = {
  children: React.ReactNode
  className?: string
}

/**
 * Form actions row (Cancel / Save) at the end of the form — not sticky.
 */
export function StickyActionBar({ children, className = "" }: Props) {
  return (
    <div
      className={`mt-4 flex flex-wrap items-center justify-end gap-3
        border-t border-zinc-700/50 pt-4
        light:border-zinc-200
        stage:border-zinc-700
        ${className}`}
    >
      {children}
    </div>
  )
}
