type PanelVariant = "card" | "flat"

type Props = {
  children: React.ReactNode
  variant?: PanelVariant
  className?: string
}

const variants: Record<PanelVariant, string> = {
  card: "border border-zinc-200/10 rounded-md bg-white/5 backdrop-blur-md p-6 shadow-md shadow-zinc-900/20 light:border-zinc-200 light:bg-white/95 light:shadow-zinc-300/30",
  flat: "border border-zinc-700 rounded-md bg-zinc-50/5 p-4 shadow-md shadow-black/20 backdrop-blur-md light:border-zinc-200 light:bg-white/90 light:shadow-zinc-300/30",
}

/**
 * Shared surface container.
 * - `card`: list items (formerly PanelContainer)
 * - `flat`: detail/settings panels (formerly panel-variant-1)
 */
export function Panel({ children, variant = "flat", className = "" }: Props) {
  if (variant === "card") {
    return (
      <div className={`relative self-start w-full ${className}`}>
        <div
          className="bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0 light:via-indigo-400/60
            box-border absolute top-0 left-0 z-10 w-full h-px"
          aria-hidden
        >
          <div className="w-full h-px bg-gradient-to-r from-indigo-700/0 from-30% via-red-600/100 via-65% to-indigo-900/0 to-90% light:via-indigo-400/50" />
        </div>
        <div className={variants.card}>{children}</div>
        <div
          className="bg-gradient-to-r from-indigo-700/0 from-40% via-indigo-600/100 via-75% to-indigo-900/0 to-95% light:via-indigo-400/60
            box-border absolute bottom-0 left-0 z-10 w-full h-px"
          aria-hidden
        />
      </div>
    )
  }

  return <div className={`${variants.flat} ${className}`}>{children}</div>
}

export default Panel
