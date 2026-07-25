import { Link, useNavigate } from "react-router-dom"
import { pageTitleClass } from "@/components/ui/PageTitle"
import { ArrowLeft } from "lucide-react"

type Props = {
  title: string
  /** Explicit parent route in the app hierarchy (not browser history). */
  backTo?: string
  actions?: React.ReactNode
  /** Play chrome: shorter row so the chart keeps viewport (S2.6). */
  compact?: boolean
}

export function PageHeader({
  title,
  backTo = "/",
  actions,
  compact = false,
}: Props) {
  const navigate = useNavigate()

  return (
    <div
      className={
        compact
          ? "flex items-center gap-2 mb-0 min-h-9"
          : "flex items-center gap-3 mb-4 min-h-11"
      }
    >
      <button
        type="button"
        onClick={() => navigate(backTo)}
        aria-label="Go back"
        className={
          compact
            ? "flex items-center justify-center min-h-9 min-w-9 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 shrink-0 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10"
            : "flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 shrink-0 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10"
        }
      >
        <ArrowLeft size={compact ? 16 : 20} />
      </button>

      <h2
        className={
          compact
            ? `${pageTitleClass} m-0 flex-1 truncate text-left text-base sm:text-lg font-semibold leading-tight stage:text-white`
            : `${pageTitleClass} m-0 flex-1 truncate text-left text-lg sm:text-2xl stage:text-white`
        }
      >
        {title}
      </h2>

      {actions && (
        <div
          className={
            compact
              ? "flex items-center gap-1 shrink-0"
              : "flex items-center gap-2 shrink-0"
          }
        >
          {actions}
        </div>
      )}
    </div>
  )
}

type PageHeaderLinkProps = {
  to: string
  children: React.ReactNode
  className?: string
  "aria-label"?: string
  compact?: boolean
}

export function PageHeaderLink({
  to,
  children,
  className = "",
  "aria-label": ariaLabel,
  compact = false,
}: PageHeaderLinkProps) {
  const sizeClass = compact
    ? "min-h-9 min-w-9 px-2 gap-1 text-xs"
    : "min-h-11 px-3 gap-1.5 text-sm"

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`flex items-center justify-center rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10 stage:focus-visible:outline-white ${sizeClass} ${className}`}
    >
      {children}
    </Link>
  )
}
