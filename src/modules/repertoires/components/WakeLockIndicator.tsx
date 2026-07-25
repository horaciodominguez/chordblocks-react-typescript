import { Moon, Sun } from "lucide-react"
import type { WakeLockStatus } from "@/modules/repertoires/hooks/useWakeLock"

type Props = {
  status: WakeLockStatus
  /** Icon-only dense control for sticky Play chrome. */
  compact?: boolean
}

/** Visible keep-awake affordance for Play mode (S2.2). */
export function WakeLockIndicator({ status, compact = false }: Props) {
  const size = compact ? 15 : 16
  const box = compact
    ? "inline-flex items-center justify-center min-h-9 min-w-9"
    : "inline-flex items-center gap-1.5 min-h-11 px-2 text-xs"

  if (!status.supported) {
    return (
      <span
        role="status"
        title="This browser cannot keep the screen awake"
        className={`${box} text-zinc-500 light:text-zinc-500 stage:text-zinc-400`}
      >
        <Moon size={size} aria-hidden />
        {!compact ? (
          <span className="hidden sm:inline">No keep-awake</span>
        ) : null}
      </span>
    )
  }

  if (status.active) {
    return (
      <span
        role="status"
        title="Screen will stay awake while in Play"
        className={`${box} text-amber-300 light:text-amber-700 stage:text-white`}
      >
        <Sun size={size} aria-hidden />
        {!compact ? <span className="hidden sm:inline">Awake</span> : null}
      </span>
    )
  }

  return (
    <span
      role="status"
      title="Could not keep the screen awake (permission or power settings)"
      className={`${box} text-zinc-500 light:text-zinc-500 stage:text-zinc-400`}
    >
      <Sun size={size} className="opacity-40" aria-hidden />
      {!compact ? <span className="hidden sm:inline">Awake off</span> : null}
    </span>
  )
}
