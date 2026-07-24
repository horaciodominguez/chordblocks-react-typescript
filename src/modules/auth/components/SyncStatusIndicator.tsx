import { Cloud, CloudOff, Loader2, WifiOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useOnlineStatus } from "@/modules/auth/hooks/useOnlineStatus"
import { usePendingQueueCount } from "@/modules/auth/hooks/usePendingQueueCount"
import { describeSyncStatus } from "@/modules/auth/utils/syncStatus"
import { ROUTES } from "@/config/navigation"

type Props = {
  /** Compact chip for the header; fuller block for Settings. */
  variant?: "chip" | "panel"
}

const kindIcon = {
  offline: WifiOff,
  syncing: Loader2,
  pending: CloudOff,
  synced: Cloud,
  local: CloudOff,
} as const

/**
 * Minimal sync trust UI: online/offline, syncing, and pending queue size.
 */
export function SyncStatusIndicator({ variant = "chip" }: Props) {
  const { user, syncing } = useAuth()
  const online = useOnlineStatus()
  const pendingCount = usePendingQueueCount()
  const status = describeSyncStatus({
    online,
    syncing,
    pendingCount,
    signedIn: Boolean(user),
  })
  const Icon = kindIcon[status.kind]
  const spin = status.kind === "syncing"

  if (variant === "panel") {
    return (
      <div
        className="rounded-md border border-zinc-700 bg-zinc-50/5 p-3 light:border-zinc-200 light:bg-zinc-50"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-sm text-zinc-200 light:text-zinc-900">
          <Icon
            size={16}
            className={`shrink-0 text-indigo-400 light:text-indigo-600 ${spin ? "animate-spin" : ""}`}
            aria-hidden
          />
          <span className="font-medium">{status.label}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500 light:text-zinc-600">
          {status.detail}
        </p>
        {!user && pendingCount > 0 ? (
          <Link
            to={ROUTES.settingsAccount}
            className="mt-2 inline-block text-xs text-indigo-400 hover:text-indigo-300 light:text-indigo-600"
          >
            Sign in to sync
          </Link>
        ) : null}
      </div>
    )
  }

  const chipClass =
    status.kind === "offline"
      ? "text-amber-400 light:text-amber-700"
      : status.kind === "pending"
        ? "text-indigo-300 light:text-indigo-600"
        : status.kind === "syncing"
          ? "text-indigo-300 light:text-indigo-600"
          : "text-zinc-500 light:text-zinc-500"

  return (
    <Link
      to={ROUTES.settingsAccount}
      title={status.detail}
      aria-label={`Sync status: ${status.label}. ${status.detail}`}
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wide min-h-8 px-1.5 rounded-sm hover:bg-zinc-100/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:hover:bg-zinc-100 ${chipClass}`}
    >
      <Icon
        size={12}
        className={`shrink-0 ${spin ? "animate-spin" : ""}`}
        aria-hidden
      />
      <span className="max-w-[5.5rem] truncate">{status.label}</span>
    </Link>
  )
}
