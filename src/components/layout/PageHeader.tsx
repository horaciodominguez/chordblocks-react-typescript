import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

type Props = {
  title: string
  backTo?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, backTo = "/", actions }: Props) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(backTo)
    }
  }

  return (
    <div className="flex items-center gap-3 mb-4 min-h-11">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 shrink-0"
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
}

export function PageHeaderLink({
  to,
  children,
  className = "",
}: PageHeaderLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-md border border-zinc-700 text-sm text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 ${className}`}
    >
      {children}
    </Link>
  )
}
