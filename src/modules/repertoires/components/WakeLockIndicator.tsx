import { Moon, Sun } from "lucide-react"
import type { WakeLockStatus } from "@/modules/repertoires/hooks/useWakeLock"

type Props = {
  status: WakeLockStatus
}

/** Visible keep-awake affordance for Play mode (S2.2). */
export function WakeLockIndicator({ status }: Props) {
  if (!status.supported) {
    return (
      <span
        role="status"
        title="This browser cannot keep the screen awake"
        className="inline-flex items-center gap-1.5 min-h-11 px-2 text-xs text-zinc-500 light:text-zinc-500"
      >
        <Moon size={16} aria-hidden />
        <span className="hidden sm:inline">No keep-awake</span>
      </span>
    )
  }

  if (status.active) {
    return (
      <span
        role="status"
        title="Screen will stay awake while in Play"
        className="inline-flex items-center gap-1.5 min-h-11 px-2 text-xs text-amber-300 light:text-amber-700"
      >
        <Sun size={16} aria-hidden />
        <span className="hidden sm:inline">Awake</span>
      </span>
    )
  }

  return (
    <span
      role="status"
      title="Could not keep the screen awake (permission or power settings)"
      className="inline-flex items-center gap-1.5 min-h-11 px-2 text-xs text-zinc-500 light:text-zinc-500"
    >
      <Sun size={16} className="opacity-40" aria-hidden />
      <span className="hidden sm:inline">Awake off</span>
    </span>
  )
}
