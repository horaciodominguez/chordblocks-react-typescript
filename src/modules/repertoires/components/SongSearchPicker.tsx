import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import Button from "@/components/ui/Button"
import type { RepertoireGroup } from "@/modules/repertoires/types/repertoire.types"

const fieldClass =
  "w-full min-h-11 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"

type Props = {
  groups: RepertoireGroup[]
  targetGroupId: string
  onTargetGroupChange: (groupId: string) => void
  onAddSong: (songId: string) => void
}

export function SongSearchPicker({
  groups,
  targetGroupId,
  onTargetGroupChange,
  onAddSong,
}: Props) {
  const { songs } = useSongs()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return songs.slice(0, 12)
    return songs
      .filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q),
      )
      .slice(0, 20)
  }, [songs, search])

  return (
    <div className="panel-variant-1 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            className={`${fieldClass} pl-9`}
            placeholder="Search library…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search songs"
          />
        </div>
        <select
          className={`${fieldClass} sm:w-44`}
          value={targetGroupId}
          onChange={(e) => onTargetGroupChange(e.target.value)}
          aria-label="Target group"
        >
          {groups.map((g, index) => (
            <option key={g.id} value={g.id}>
              {g.title.trim() || `Group ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {songs.length === 0 ? (
        <p className="text-sm text-zinc-500">No songs in your library yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">No matches.</p>
      ) : (
        <ul className="flex flex-col gap-1 max-h-56 overflow-y-auto scrollbar-app pr-1">
          {filtered.map((song) => (
            <li
              key={song.id}
              className="flex items-center justify-between gap-2 py-1.5 border-b border-zinc-800 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm text-zinc-100 truncate">{song.title}</p>
                <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="min-h-10 shrink-0 px-3"
                onClick={() => onAddSong(song.id)}
              >
                Add
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
