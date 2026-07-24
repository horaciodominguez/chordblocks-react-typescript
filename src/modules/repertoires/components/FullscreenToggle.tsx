import { Maximize, Minimize } from "lucide-react"

type Props = {
  active: boolean
  supported: boolean
  onToggle: () => void
}

/** Enter / exit browser fullscreen in Play (S2.5). */
export function FullscreenToggle({ active, supported, onToggle }: Props) {
  if (!supported) return null

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? "Exit fullscreen" : "Enter fullscreen"}
      title={active ? "Exit fullscreen" : "Fullscreen"}
      className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-2.5 rounded-md border border-zinc-700 text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100 stage:border-white stage:text-white stage:hover:bg-white/10 stage:focus-visible:outline-white"
    >
      {active ? <Minimize size={16} aria-hidden /> : <Maximize size={16} aria-hidden />}
      <span className="hidden sm:inline text-sm">
        {active ? "Exit full" : "Full"}
      </span>
    </button>
  )
}
