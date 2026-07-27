import { Plus } from "lucide-react"
import { chordFlexStyle } from "@/modules/chords/utils/chord.utils"

type Props = {
  onClick: () => void
  /** Beat share for flex width (remaining in bar, or full measure below). */
  beats: number
  /** Accessible label; default matches the visual affordance. */
  label?: string
}

/** Dashed “+ Add Block” slot — 100% row height, remaining (or new-bar) width. */
export function AddBlockSlot({
  onClick,
  beats,
  label = "Add Block",
}: Props) {
  const beatShare = Math.max(1, beats)

  return (
    <div
      style={chordFlexStyle(beatShare)}
      className="box-border flex min-h-0 min-w-0 flex-col self-stretch"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="
          box-border flex w-full flex-1 flex-col
          items-center justify-center gap-1
          px-2 py-2
          rounded-md
          border border-dashed border-zinc-400/60
          bg-transparent
          text-zinc-100
          hover:bg-indigo-500/10 hover:border-indigo-400/55 hover:text-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50
          transition-colors
          light:border-zinc-400/70 light:text-zinc-800
          light:hover:bg-indigo-500/10 light:hover:border-indigo-500/50 light:hover:text-indigo-900
        "
      >
        <Plus className="w-7 h-7 shrink-0" strokeWidth={2} aria-hidden />
        <span className="text-sm font-semibold tracking-wide">{label}</span>
      </button>
    </div>
  )
}
