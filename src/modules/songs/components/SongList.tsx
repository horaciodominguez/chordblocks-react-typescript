import { Link } from "react-router-dom"
import { AudioLines, Edit, Trash } from "lucide-react"
import { useSongs } from "../hooks/useSongs"

import PanelContainer from "@/components/ui/PanelContainer"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { toast } from "sonner"
import { useMemo, useState } from "react"

export const SongList = () => {
  const { songs, deleteSong, loading } = useSongs()

  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [genre, setGenre] = useState("")

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

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title or artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm"
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
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
            <h3 className="text-sm text-gray-400 mb-4">
              Artist: {song.artist}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Time Measure: {song.timeSignature.beatsPerMeasure} /{" "}
              {song.timeSignature.noteValue}
            </p>
            <div className="flex justify-end gap-4">
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
          </PanelContainer>
        ))}
      </div>
    </>
  )
}
