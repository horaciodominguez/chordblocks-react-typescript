import { forwardRef, type ReactNode } from "react"
import { SetItemNotes } from "@/modules/repertoires/components/SetItemNotes"

type Props = {
  header: ReactNode
  atrilControls?: ReactNode
  notes?: string | null
}

/**
 * Sticky Play chrome: header + Size/Stage + optional cue.
 * Opaque background matches SetSongNav (no broken CSS vars).
 * `data-no-play-gesture` excludes this bar from chart gestures (S2.7).
 */
export const PlayChrome = forwardRef<HTMLDivElement, Props>(
  function PlayChrome({ header, atrilControls, notes }, ref) {
    const cue = notes?.trim()

    return (
      <div
        ref={ref}
        data-no-play-gesture=""
        className={[
          "no-print sticky top-0 z-20",
          "-mx-3 md:-mx-5 lg:-mx-6 px-3 md:px-5 lg:px-6",
          "py-1.5 mb-2",
          "border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md",
          "light:border-zinc-200 light:bg-white/95",
          "stage:border-zinc-700 stage:bg-black stage:backdrop-blur-none",
        ].join(" ")}
      >
        {header}
        {atrilControls ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {atrilControls}
          </div>
        ) : null}
        {cue ? (
          <div className="mt-1.5 rounded-md border border-amber-500/25 bg-amber-400/10 px-2.5 py-1.5 light:border-amber-200 light:bg-amber-50 stage:border-zinc-600 stage:bg-zinc-950">
            <SetItemNotes notes={cue} compact />
          </div>
        ) : null}
      </div>
    )
  },
)
