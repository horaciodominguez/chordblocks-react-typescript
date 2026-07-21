type TabItem = {
  id: string
  label: string
}

type Props = {
  items: readonly TabItem[]
  value: string
  onChange: (id: string) => void
  "aria-label": string
  /** Stretch tabs equally across the container (Settings-style). Default true. */
  fullWidth?: boolean
  className?: string
  getTabId?: (id: string) => string
  getPanelId?: (id: string) => string
}

/**
 * Shared segmented tabs — same chrome as Settings (Data / Account).
 */
export function SegmentedTabs({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  fullWidth = true,
  className = "",
  getTabId,
  getPanelId,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-1 p-1 rounded-lg bg-zinc-900/80 border border-zinc-800 ${className}`}
    >
      {items.map((item) => {
        const selected = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            id={getTabId?.(item.id)}
            aria-controls={getPanelId?.(item.id)}
            className={`${fullWidth ? "flex-1" : "px-4"} min-h-11 rounded-md text-sm uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              selected
                ? "bg-indigo-600/30 text-indigo-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedTabs
