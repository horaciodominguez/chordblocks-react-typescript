import { Link } from "react-router-dom"
import {
  AudioLines,
  Edit,
  Music,
  Search,
  SlidersHorizontal,
  Trash,
  X,
} from "lucide-react"
import { useSongs } from "../hooks/useSongs"

import PanelContainer from "@/components/ui/PanelContainer"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

const actionBtnClass =
  "flex justify-center items-center min-h-11 min-w-11 border border-zinc-700 rounded-md text-sm text-indigo-400 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"

export const SongList = () => {
  const { songs, deleteSong, initialLoading, mutating } = useSongs()

  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [genre, setGenre] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const genres = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.genre)))
  }, [songs])

  const years = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.year.toString()))).sort(
      (a, b) => Number(b) - Number(a),
    )
  }, [songs])

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase())

      const matchesYear = !year || song.year.toString() === year
      const matchesGenre = !genre || song.genre === genre

      return matchesSearch && matchesYear && matchesGenre
    })
  }, [songs, search, year, genre])

  if (initialLoading) return <LoaderSpinner />

  if (!songs.length) {
    return (
      <div className="text-center py-12 px-4">
        <Music size={48} className="mx-auto mb-4 text-zinc-600" />
        <p className="mb-2 text-lg text-gray-200">No songs yet</p>
        <p className="mb-6 text-sm text-zinc-500">
          Create your first chord progression to get started.
        </p>
        <Link
          to="/new"
          className="inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add your first song
        </Link>
      </div>
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
      className="flex items-center gap-1 px-3 py-2 text-xs rounded-full bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 min-h-9"
    >
      {label}
      <X size={12} />
    </button>
  )

  return (
    <>
      <div className="flex justify-end items-center mb-2">
        <Button
          variant="primary"
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 min-h-11"
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2 mb-4 w-full">
          <div className="w-full sm:flex-1">
            <Input
              name="search"
              value={search}
              placeholder="Search songs or artists"
              icon={<Search size={16} />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[140px]">
            <Select
              name="year"
              options={years}
              value={year}
              defaultValue="All years"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[140px]">
            <Select
              name="genre"
              options={genres}
              value={genre}
              defaultValue="All genres"
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {search && <FilterChip label={search} onClear={() => setSearch("")} />}
        {year && <FilterChip label={year} onClear={() => setYear("")} />}
        {genre && <FilterChip label={genre} onClear={() => setGenre("")} />}
      </div>

      {filteredSongs.length === 0 && (
        <p className="text-center text-zinc-500 py-8">
          No songs match your filters.
        </p>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${mutating ? "opacity-60 pointer-events-none" : ""}`}
      >
        {filteredSongs.map((song) => (
          <PanelContainer key={song.id}>
            <h2 className="mb-4">
              <Link
                className="uppercase font-bold text-gray-200 hover:text-indigo-300"
                to={`/song/${song.id}`}
              >
                {song.title}
              </Link>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3 sm:mr-0 shrink-0">
                {song.imageUrl || song.imageBase64 ? (
                  <img
                    src={song.imageUrl ?? song.imageBase64!}
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
                  <h3 className="text-sm text-gray-400 mb-1">{song.artist}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {song.timeSignature.beatsPerMeasure} /{" "}
                    {song.timeSignature.noteValue}
                  </p>
                  <p className="text-sm text-gray-400">
                    {song.genre}
                    {song.genre && song.year ? " · " : ""}
                    {song.year || ""}
                  </p>
                </div>
                <div className="flex justify-start gap-2">
                  <Link
                    className={actionBtnClass}
                    to={`/song/${song.id}`}
                    aria-label={`View ${song.title}`}
                  >
                    <AudioLines width={18} height={18} />
                  </Link>
                  <Link
                    className={actionBtnClass}
                    to={`/song/${song.id}/edit`}
                    aria-label={`Edit ${song.title}`}
                  >
                    <Edit width={18} height={18} />
                  </Link>
                  <ConfirmDialog
                    title="Delete song?"
                    description={`Are you sure you want to delete "${song.title}"? This action cannot be undone.`}
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
                </div>
              </div>
            </div>
          </PanelContainer>
        ))}
      </div>
    </>
  )
}
