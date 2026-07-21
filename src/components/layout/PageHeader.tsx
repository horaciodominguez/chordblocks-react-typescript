import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

type Props = {
  title: string
  /** Explicit parent route in the app hierarchy (not browser history). */
  backTo?: string
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  backTo = "/",
  actions,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 mb-4 min-h-11">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        aria-label="Go back"
        className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 shrink-0 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100"
      >
        <ArrowLeft size={20} />
      </button>

      <h2 className="page-title m-0 flex-1 text-left text-lg sm:text-2xl truncate">
        {title}
      </h2>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}

type PageHeaderLinkProps = {
  to: string
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}

export function PageHeaderLink({
  to,
  children,
  className = "",
  "aria-label": ariaLabel,
}: PageHeaderLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-md border border-zinc-700 text-sm text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 ${className}`}
    >
      {children}
    </Link>
  )
}
