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

export const SongList = () => {
  const { songs, deleteSong, loading } = useSongs()

  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [genre, setGenre] = useState("")

  const [showFilters, setShowFilters] = useState(false)

  const genres = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.genre)))
  }, [songs])

  const years = useMemo(() => {
    return Array.from(new Set(songs.map((s) => s.year.toString()))).sort(
      (a, b) => Number(b) - Number(a)
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

  if (loading) return LoaderSpinner()
  if (!songs.length)
    return (
      <div className="text-center py-6">
        <p className="mb-4">No songs yet</p>
        <Link
          to="/new"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add your first song
        </Link>
      </div>
    )

  const FilterChip = ({
    label,
    onClear,
  }: {
    label: string
    onClear: () => void
  }) => (
    <button
      onClick={onClear}
      className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-900/40 text-blue-300 hover:bg-blue-900/60"
    >
      {label}
      <X size={12} />
    </button>
  )

  return (
    <>
      <div className="flex justify-end align-center">
        <Button
          variant="primary"
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 "
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>
      {showFilters && (
        <div className="flex flex-wrap justify-end gap-2 mt-4 mb-4">
          <div>
            <Input
              name="search"
              value={search}
              placeholder="Search songs or artists"
              icon={<Search size={16} />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <Select
              name="year"
              options={years}
              value={year}
              defaultValue="All years"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div>
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

      <div className="flex gap-2 mb-4">
        {search && <FilterChip label={search} onClear={() => setSearch("")} />}
        {year && <FilterChip label={year} onClear={() => setYear("")} />}
        {genre && <FilterChip label={genre} onClear={() => setGenre("")} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {filteredSongs.map((song) => (
          <PanelContainer key={song.id}>
            <h2 className="mb-4">
              <Link
                className="uppercase font-bold text-gray-200"
                to={`/song/${song.id}`}
              >
                {song.title}
              </Link>
            </h2>
            <div className="flex flex-row">
              <div className="w-1/3 mr-4">
                <div className="w-full">
                  {song.imageUrl || song.imageBase64 ? (
                    <img
                      src={song.imageUrl ?? song.imageBase64!}
                      alt={song.title}
                      className="w-full aspect-square object-cover rounded mb-4"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-zinc-800 rounded flex items-center justify-center mb-4">
                      <Music size={48} className="text-zinc-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-2/3 flex flex-col justify-space-between">
                <h3 className="text-sm text-gray-400 mb-2">{song.artist}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {song.timeSignature.beatsPerMeasure} /{" "}
                  {song.timeSignature.noteValue}
                </p>
                <div className="flex justify-start gap-4">
                  <Link
                    className="
                      flex 
                      justify-center items-center
                      px-2 py-2 
                      border-1 border-zinc-700 rounded-md text-sm text-indigo-400 hover:text-gray-200"
                    to={`/song/${song.id}`}
                  >
                    <AudioLines width={16} height={16} />
                  </Link>
                  <Link
                    className="
                      flex 
                      justify-center items-center
                      px-2 py-2 
                      border-1 border-zinc-700 rounded-md text-sm text-indigo-400 hover:text-gray-200"
                    to={`/song/${song.id}/edit`}
                  >
                    <Edit width={16} height={16} />
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
                        className=" flex 
                              justify-center items-center
                              px-2 py-2 
                              border-1 border-zinc-700 
                              rounded-md text-sm text-red-500 hover:text-red-400"
                      >
                        <Trash width={16} height={16} />
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
