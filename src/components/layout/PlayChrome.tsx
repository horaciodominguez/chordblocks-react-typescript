import type { ReactNode } from "react"
import { SetItemNotes } from "@/modules/repertoires/components/SetItemNotes"

type Props = {
  header: ReactNode
  /** Font size + Stage row (owned by Song via render prop / children). */
  atrilControls?: ReactNode
  notes?: string | null
}

/**
 * Sticky Play chrome: compact header + atril controls + cue.
 * Height is intentionally tight — chart space is the priority (S2.6).
 */
export function PlayChrome({ header, atrilControls, notes }: Props) {
  const cue = notes?.trim()

  return (
    <div
      className={[
        "sticky top-0 z-20 -mx-3 md:-mx-5 lg:-mx-6 mb-2",
        "bg-[rgb(var(--bg))]/95 backdrop-blur-md border-b border-white/10",
        "light:bg-white/95 light:border-zinc-200",
        "stage:bg-black stage:border-zinc-700 stage:backdrop-blur-none",
      ].join(" ")}
    >
      <div className="px-3 md:px-5 lg:px-6 pt-1 pb-1">{header}</div>
      {atrilControls ? (
        <div className="px-3 md:px-5 lg:px-6 pb-1 flex flex-wrap items-center gap-1.5 border-t border-white/5 light:border-zinc-100 stage:border-zinc-800">
          {atrilControls}
        </div>
      ) : null}
      {cue ? (
        <div className="px-3 md:px-5 lg:px-6 py-1 border-t border-amber-500/20 bg-amber-400/[0.06] light:bg-amber-50/90 light:border-amber-200 stage:bg-zinc-950 stage:border-zinc-700">
          <SetItemNotes notes={cue} compact />
        </div>
      ) : null}
    </div>
  )
}
