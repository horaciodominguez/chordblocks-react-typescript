import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { SetNavContext } from "@/modules/repertoires/utils/repertoire.navigation"
import { setSongPath } from "@/modules/repertoires/utils/repertoire.navigation"

type Props = {
  nav: SetNavContext
  playMode?: boolean
}

const navBtnClass =
  "flex items-center justify-center gap-1 min-h-11 px-3 rounded-md border border-zinc-700 text-sm text-indigo-300 hover:text-gray-200 hover:bg-zinc-800/50 light:border-zinc-200 light:text-indigo-700 light:hover:text-zinc-900 light:hover:bg-zinc-100"

const navBtnDisabledClass =
  "flex items-center justify-center gap-1 min-h-11 px-3 rounded-md border border-zinc-800 text-sm text-zinc-600 opacity-50 light:border-zinc-200 light:text-zinc-400"

export function SetSongNav({ nav, playMode = false }: Props) {
  const { prev, next, current, total, repertoireId } = nav
  const position = current.index + 1
  const pathOpts = playMode ? ({ mode: "play" } as const) : undefined

  return (
    <nav
      aria-label="Set navigation"
      className={`fixed inset-x-0 z-20
        border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md
        light:border-zinc-200 light:bg-white/95
        ${
          playMode
            ? "bottom-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
            : "bottom-[calc(3.5rem+env(safe-area-inset-bottom))] md:bottom-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-3"
        }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-2">
        {prev ? (
          <Link
            to={setSongPath(
              prev.item.songId,
              repertoireId,
              prev.item.id,
              pathOpts,
            )}
            className={navBtnClass}
            aria-label="Previous song in set"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <span role="button" className={navBtnDisabledClass} aria-disabled="true">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Prev</span>
          </span>
        )}

        <p className="flex-1 text-center text-sm text-zinc-400 tabular-nums light:text-zinc-600">
          {position} / {total}
        </p>

        {next ? (
          <Link
            to={setSongPath(
              next.item.songId,
              repertoireId,
              next.item.id,
              pathOpts,
            )}
            className={navBtnClass}
            aria-label="Next song in set"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <span role="button" className={navBtnDisabledClass} aria-disabled="true">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} />
          </span>
        )}
      </div>
    </nav>
  )
}
