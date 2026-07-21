import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { panelFlatClass } from "@/components/ui/Panel"
import { Select } from "@/components/ui/Select"
import type { RepertoireGroup } from "@/modules/repertoires/types/repertoire.types"

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

  const groupOptions = groups.map((g) => g.id)
  const groupLabels = Object.fromEntries(
    groups.map((g, index) => [
      g.id,
      g.title.trim() || `Group ${index + 1}`,
    ]),
  )

  return (
    <div className={`${panelFlatClass} flex flex-col gap-3`}>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex-1 min-w-0">
          <Input
            name="library-search"
            alwaysEditable
            value={search}
            placeholder="Search library…"
            icon={<Search size={16} />}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search songs"
          />
        </div>
        <div className="sm:w-44 shrink-0">
          <Select
            name="target-group"
            label="Target group"
            options={groupOptions}
            optionLabels={groupLabels}
            value={targetGroupId}
            onChange={(e) => onTargetGroupChange(e.target.value)}
          />
        </div>
      </div>

      {songs.length === 0 ? (
        <p className="text-sm text-zinc-500 light:text-zinc-600">No songs in your library yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 light:text-zinc-600">No matches.</p>
      ) : (
        <ul className="flex flex-col gap-1 max-h-56 overflow-y-auto scrollbar-app pr-1">
          {filtered.map((song) => (
            <li
              key={song.id}
              className="flex items-center justify-between gap-2 py-1.5 border-b border-zinc-800 last:border-0 light:border-zinc-200"
            >
              <div className="min-w-0">
                <p className="text-sm text-zinc-100 truncate light:text-zinc-900">{song.title}</p>
                <p className="text-xs text-zinc-500 truncate light:text-zinc-600">{song.artist}</p>
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
