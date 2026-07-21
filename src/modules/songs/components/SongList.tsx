import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  AudioLines,
  Edit,
  Music,
  Plus,
  Search,
  SlidersHorizontal,
  Trash,
  X,
} from "lucide-react"
import { useSongs } from "../hooks/useSongs"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import Panel from "@/components/ui/Panel"
import EmptyState from "@/components/ui/EmptyState"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import SegmentedTabs from "@/components/ui/SegmentedTabs"
import { ROUTES } from "@/config/navigation"
import {
  artistDisplayName,
  filterSongs,
  getArtistIndex,
  groupSongsByArtist,
  normalizeArtistKey,
  sortSongs,
  type SongSort,
} from "@/modules/songs/utils/songCatalog"
import { findRepertoiresReferencingSong } from "@/modules/repertoires/utils/repertoire.catalog"
import type { Song } from "@/modules/songs/types/song.types"

type CatalogView = "list" | "artists"

const SORT_OPTIONS = [
  { value: "updated-desc", label: "Recently updated" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "artist-asc", label: "Artist A–Z" },
  { value: "year-desc", label: "Year (newest)" },
] as const

const actionBtnClass =
  "flex justify-center items-center min-h-11 min-w-11 border border-zinc-700 rounded-md text-sm text-indigo-400 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"

function parseSort(value: string | null): SongSort {
  if (
    value === "title-asc" ||
    value === "artist-asc" ||
    value === "updated-desc" ||
    value === "year-desc"
  ) {
    return value
  }
  return "updated-desc"
}

function parseView(value: string | null): CatalogView {
  return value === "artists" ? "artists" : "list"
}

export const SongList = () => {
  const { songs, deleteSong, mutating } = useSongs()
  const { repertoires } = useRepertoires()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get("q") ?? ""
  const year = searchParams.get("year") ?? ""
  const genre = searchParams.get("genre") ?? ""
  const artistKey = searchParams.get("artist") ?? ""
  const sort = parseSort(searchParams.get("sort"))
  const view = parseView(searchParams.get("view"))
  const [showFilters, setShowFilters] = useState(
    Boolean(year || genre || artistKey || searchParams.get("sort")),
  )

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const genres = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.genre))).filter(Boolean)
  }, [songs])

  const years = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.year.toString()))).sort(
      (a, b) => Number(b) - Number(a),
    )
  }, [songs])

  const filteredSongs = useMemo(() => {
    return sortSongs(
      filterSongs(songs, { search, year, genre, artistKey }),
      sort,
    )
  }, [songs, search, year, genre, artistKey, sort])

  const artistGroups = useMemo(
    () => groupSongsByArtist(filteredSongs),
    [filteredSongs],
  )
  const letterIndex = useMemo(
    () => getArtistIndex(artistGroups),
    [artistGroups],
  )

  if (!songs.length) {
    return (
      <EmptyState
        icon={<Music size={48} />}
        title="No songs yet"
        description="Create your first chord progression to get started."
        actionLabel="Create your first song"
        onAction={() => navigate(ROUTES.newSong)}
      />
    )
  }

  const FilterChip = ({
    label,
    onClear,
  }: {
    label: string
    onClear: () => void
  }) => (
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60"
    >
      {label}
      <X size={12} />
    </button>
  )

  const deleteSongActions = (song: Song) => (
    <ConfirmDialog
      title="Delete song?"
      description={(() => {
        const refs = findRepertoiresReferencingSong(repertoires, song.id)
        const base = `Are you sure you want to delete "${song.title}"? This action cannot be undone.`
        if (!refs.length) return base
        return `${base} It is used in: ${refs.map((r) => r.title).join(", ")}.`
      })()}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={async () => {
        try {
          await deleteSong(song.id)
          toast.success(`Song "${song.title}" deleted`)
        } catch {
          toast.error("Error deleting song")
        }
      }}
      trigger={
        <button
          type="button"
          aria-label={`Delete ${song.title}`}
          className={`${actionBtnClass} text-red-500 hover:text-red-400`}
        >
          <Trash width={18} height={18} />
        </button>
      }
    />
  )

  const renderSongCard = (song: Song) => (
    <Panel key={song.id} variant="card">
      <h2 className="mb-4">
        <Link
          className="uppercase font-bold text-zinc-200 hover:text-indigo-300"
          to={ROUTES.song(song.id)}
        >
          {song.title}
        </Link>
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3 sm:mr-0 shrink-0">
          {song.imageBase64 || song.imageUrl ? (
            <img
              src={song.imageBase64 ?? song.imageUrl!}
              alt={song.title}
              className="w-full aspect-square object-cover rounded"
            />
          ) : (
            <div className="w-full aspect-square bg-zinc-800 rounded flex items-center justify-center">
              <Music size={48} className="text-zinc-500" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-sm text-zinc-400 mb-1">
              <Link
                to={`${ROUTES.songs}?view=artists&artist=${encodeURIComponent(normalizeArtistKey(song.artist))}`}
                className="hover:text-indigo-300"
              >
                {artistDisplayName(song.artist)}
              </Link>
            </h3>
            <p className="text-sm text-zinc-400 mb-2">
              {song.timeSignature.beatsPerMeasure} /{" "}
              {song.timeSignature.noteValue}
            </p>
            <p className="text-sm text-zinc-400">
              {song.genre}
              {song.genre && song.year ? " · " : ""}
              {song.year || ""}
            </p>
          </div>
          <div className="flex justify-start gap-2">
            <Link
              className={actionBtnClass}
              to={ROUTES.song(song.id)}
              aria-label={`View ${song.title}`}
            >
              <AudioLines width={18} height={18} />
            </Link>
            <Link
              className={actionBtnClass}
              to={ROUTES.songEdit(song.id)}
              aria-label={`Edit ${song.title}`}
            >
              <Edit width={18} height={18} />
            </Link>
            {deleteSongActions(song)}
          </div>
        </div>
      </div>
    </Panel>
  )

  /** Compact row for artist grouping — avoids stacking heavy cards. */
  const renderSongRow = (song: Song) => (
    <li
      key={song.id}
      className="flex items-center gap-3 rounded-md border border-zinc-800/80 bg-zinc-950/40 px-3 py-2"
    >
      <Link
        to={ROUTES.song(song.id)}
        className="flex-1 min-w-0 font-medium text-zinc-100 hover:text-indigo-300 truncate"
      >
        {song.title}
      </Link>
      <span className="hidden sm:inline text-xs text-zinc-500 shrink-0">
        {song.genre}
        {song.genre && song.year ? " · " : ""}
        {song.year || ""}
      </span>
      <div className="flex gap-1.5 shrink-0">
        <Link
          className={actionBtnClass}
          to={ROUTES.song(song.id)}
          aria-label={`View ${song.title}`}
        >
          <AudioLines width={16} height={16} />
        </Link>
        <Link
          className={actionBtnClass}
          to={ROUTES.songEdit(song.id)}
          aria-label={`Edit ${song.title}`}
        >
          <Edit width={16} height={16} />
        </Link>
        {deleteSongActions(song)}
      </div>
    </li>
  )

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <SegmentedTabs
          aria-label="Catalog view"
          items={[
            { id: "list", label: "List" },
            { id: "artists", label: "Artists" },
          ]}
          value={view}
          onChange={(id) => setParam("view", id === "list" ? "" : id)}
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 w-full min-w-0">
            <Input
              name="search"
              value={search}
              placeholder="Search songs or artists"
              icon={<Search size={16} />}
              onChange={(e) => setParam("q", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              type="button"
              variant="primary"
              className="inline-flex items-center gap-2"
              onClick={() => navigate(ROUTES.newSong)}
            >
              <Plus size={16} />
              New song
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-2"
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full items-end">
            <Select
              name="sort"
              label="Sort"
              options={SORT_OPTIONS.map((o) => o.value)}
              optionLabels={Object.fromEntries(
                SORT_OPTIONS.map((o) => [o.value, o.label]),
              )}
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
            />
            <Select
              name="year"
              label="Year"
              options={years}
              value={year}
              defaultValue="All years"
              onChange={(e) => setParam("year", e.target.value)}
            />
            <Select
              name="genre"
              label="Genre"
              options={genres}
              value={genre}
              defaultValue="All genres"
              onChange={(e) => setParam("genre", e.target.value)}
            />
          </div>
        )}

        {(search || year || genre || artistKey) && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <FilterChip label={search} onClear={() => setParam("q", "")} />
            )}
            {year && (
              <FilterChip label={year} onClear={() => setParam("year", "")} />
            )}
            {genre && (
              <FilterChip label={genre} onClear={() => setParam("genre", "")} />
            )}
            {artistKey && (
              <FilterChip
                label={`Artist: ${artistKey === "unknown" ? "Unknown" : artistKey}`}
                onClear={() => setParam("artist", "")}
              />
            )}
          </div>
        )}
      </div>

      {filteredSongs.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">
          No songs match your filters.
        </p>
      ) : view === "artists" ? (
        <div className="flex flex-col gap-5">
          {letterIndex.length > 1 && !artistKey ? (
            <nav
              aria-label="Artist index"
              className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-zinc-500"
            >
              {letterIndex.map((letter, i) => (
                <span key={letter} className="inline-flex items-center">
                  {i > 0 ? (
                    <span className="mx-0.5 text-zinc-700" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <a
                    href={`#artist-letter-${letter === "#" ? "other" : letter}`}
                    className="px-1 py-0.5 rounded text-indigo-400/90 hover:text-indigo-200 hover:bg-zinc-900/60"
                  >
                    {letter}
                  </a>
                </span>
              ))}
            </nav>
          ) : null}

          {artistGroups.map((group) => (
            <section
              key={group.key}
              id={`artist-letter-${group.letter === "#" ? "other" : group.letter}`}
              className="flex flex-col gap-2"
            >
              <div className="flex items-baseline justify-between gap-2 border-b border-zinc-800 pb-1.5">
                <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">
                  {group.displayName}
                </h2>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {group.songs.length}
                </span>
              </div>
              <ul
                className={`flex flex-col gap-1.5 ${mutating ? "opacity-60 pointer-events-none" : ""}`}
              >
                {group.songs.map(renderSongRow)}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${mutating ? "opacity-60 pointer-events-none" : ""}`}
        >
          {filteredSongs.map(renderSongCard)}
        </div>
      )}
    </>
  )
}
