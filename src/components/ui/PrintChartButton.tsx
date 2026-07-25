import { Printer } from "lucide-react"

type Props = {
  /** Dense icon-only control for Play chrome. */
  compact?: boolean
  className?: string
}

/** Opens the system print dialog (Save as PDF) for the chart (S2.9). */
export function PrintChartButton({ compact = false, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Print or save chart as PDF"
      title="Print / PDF"
      className={
        compact
          ? `inline-flex items-center justify-center min-h-9 min-w-9 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10 ${className}`
          : `inline-flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-md border border-zinc-700 text-sm text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10 ${className}`
      }
    >
      <Printer size={compact ? 14 : 16} aria-hidden />
      {!compact ? <span className="hidden sm:inline">Print</span> : null}
    </button>
  )
}
