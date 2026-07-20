import { useMemo, useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Download, Upload } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import { buildExportPackage } from "@/modules/io/utils/buildExportPackage"
import { downloadJson, exportFilename } from "@/modules/io/utils/downloadJson"
import {
  cloneRepertoireWithSongMap,
  defaultResolutions,
  findSongConflicts,
  parseExportPackage,
  prepareSongImports,
  type SongConflict,
} from "@/modules/io/utils/importPackage"
import type {
  SongConflictAction,
  SongImportResolution,
  ChordBlocksExport,
} from "@/modules/io/types/export.types"

/** Settings → Data: import/export songs and sets */
export function DataTransferPanel() {
  const { songs, addSong, updateSong, mutating } = useSongs()
  const { repertoires, updateRepertoire } = useRepertoires()
  const fileRef = useRef<HTMLInputElement>(null)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [exportRepId, setExportRepId] = useState("")
  const [importOpen, setImportOpen] = useState(false)
  const [pendingPkg, setPendingPkg] = useState<ChordBlocksExport | null>(null)
  const [conflicts, setConflicts] = useState<SongConflict[]>([])
  const [resolutions, setResolutions] = useState<SongImportResolution[]>([])
  const [importing, setImporting] = useState(false)

  const allSelected =
    songs.length > 0 && songs.every((s) => selectedIds.has(s.id))

  const conflictByPkgId = useMemo(() => {
    const map = new Map<string, SongConflict>()
    for (const c of conflicts) map.set(c.packageSong.id, c)
    return map
  }, [conflicts])

  const toggleSong = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(songs.map((s) => s.id)))
  }

  const handleExportSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one song")
      return
    }
    try {
      const selected = songs.filter((s) => selectedIds.has(s.id))
      const pkg = buildExportPackage({ songs: selected })
      downloadJson(exportFilename("chordblocks-songs"), pkg)
      toast.success(`Exported ${pkg.songs.length} songs`)
    } catch (err) {
      console.error(err)
      toast.error("Export failed")
    }
  }

  const handleExportAll = () => {
    if (songs.length === 0) {
      toast.error("No songs to export")
      return
    }
    try {
      const pkg = buildExportPackage({ songs })
      downloadJson(exportFilename("chordblocks-songs-all"), pkg)
      toast.success(`Exported ${pkg.songs.length} songs`)
    } catch (err) {
      console.error(err)
      toast.error("Export failed")
    }
  }

  const handleExportRepertoire = () => {
    const rep = repertoires.find((r) => r.id === exportRepId)
    if (!rep) {
      toast.error("Choose a set to export")
      return
    }
    try {
      const pkg = buildExportPackage({
        repertoires: [rep],
        allSongs: songs,
      })
      const safe =
        rep.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "set"
      downloadJson(exportFilename(`chordblocks-${safe}`), pkg)
      toast.success(
        `Exported set with ${pkg.songs.length} song${pkg.songs.length === 1 ? "" : "s"}`,
      )
    } catch (err) {
      console.error(err)
      toast.error("Export failed — set needs songs")
    }
  }

  const handleFile = async (file: File) => {
    try {
      const text = await file.text()
      const raw = JSON.parse(text) as unknown
      const pkg = parseExportPackage(raw)
      const found = findSongConflicts(pkg.songs, songs)
      setPendingPkg(pkg)
      setConflicts(found)
      setResolutions(defaultResolutions(pkg.songs, found))
      setImportOpen(true)
    } catch (err) {
      console.error(err)
      toast.error("Invalid ChordBlocks JSON")
    }
  }

  const setAction = (packageSongId: string, action: SongConflictAction) => {
    setResolutions((prev) =>
      prev.map((r) =>
        r.packageSongId === packageSongId ? { ...r, action } : r,
      ),
    )
  }

  const applyImport = async () => {
    if (!pendingPkg) return
    setImporting(true)
    try {
      const { prepared, songIdMap } = prepareSongImports(
        pendingPkg.songs,
        songs,
        resolutions,
      )

      for (const item of prepared) {
        if (item.mode === "skip" || !item.song) continue
        if (item.mode === "update") await updateSong(item.song)
        else await addSong(item.song)
      }

      if (pendingPkg.repertoires?.length) {
        for (const rep of pendingPkg.repertoires) {
          const cloned = cloneRepertoireWithSongMap(rep, songIdMap)
          await updateRepertoire(cloned)
        }
      }

      const added = prepared.filter((p) => p.mode === "add").length
      const updated = prepared.filter((p) => p.mode === "update").length
      const skipped = prepared.filter((p) => p.mode === "skip").length
      toast.success(
        `Import done: ${added} added, ${updated} replaced, ${skipped} skipped` +
          (pendingPkg.repertoires?.length
            ? `, ${pendingPkg.repertoires.length} set(s)`
            : ""),
      )
      setImportOpen(false)
      setPendingPkg(null)
    } catch (err) {
      console.error(err)
      toast.error("Import failed")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-200">Import</h2>
        <p className="text-sm text-zinc-500">
          Load a ChordBlocks JSON package (songs and optional sets). Title
          conflicts ask before overwriting.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ""
            if (file) void handleFile(file)
          }}
        />
        <Button
          type="button"
          variant="secondary"
          className="min-h-11 inline-flex items-center gap-2 w-fit"
          onClick={() => fileRef.current?.click()}
          disabled={mutating || importing}
        >
          <Upload size={16} />
          Import JSON
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-200">Export songs</h2>
        <p className="text-sm text-zinc-500">
          Choose songs to export, or export the whole library.
        </p>
        {songs.length === 0 ? (
          <p className="text-sm text-zinc-500">No songs in the library yet.</p>
        ) : (
          <>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-400 min-h-11 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
              Select all ({songs.length})
            </label>
            <ul className="max-h-56 overflow-y-auto border border-zinc-800 rounded-md divide-y divide-zinc-800">
              {songs.map((song) => (
                <li key={song.id}>
                  <label className="flex items-center gap-3 px-3 py-2.5 min-h-11 cursor-pointer hover:bg-zinc-900/60">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(song.id)}
                      onChange={() => toggleSong(song.id)}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-zinc-100 truncate">
                        {song.title}
                      </span>
                      <span className="block text-xs text-zinc-500 truncate">
                        {song.artist}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="primary"
                className="min-h-11 inline-flex items-center gap-2"
                onClick={handleExportSelected}
                disabled={mutating || selectedIds.size === 0}
              >
                <Download size={16} />
                Export selected ({selectedIds.size})
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 inline-flex items-center gap-2"
                onClick={handleExportAll}
                disabled={mutating || songs.length === 0}
              >
                <Download size={16} />
                Export all
              </Button>
            </div>
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-200">Export set</h2>
        <p className="text-sm text-zinc-500">
          Includes the set and each referenced song once (no duplicates).
        </p>
        <select
          className="min-h-11 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-100"
          value={exportRepId}
          onChange={(e) => setExportRepId(e.target.value)}
          aria-label="Set to export"
        >
          <option value="">Choose a set…</option>
          {repertoires.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="primary"
          className="min-h-11 inline-flex items-center gap-2 w-fit"
          onClick={handleExportRepertoire}
          disabled={mutating || !exportRepId}
        >
          <Download size={16} />
          Export set
        </Button>
      </section>

      <Dialog.Root
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open)
          if (!open) setPendingPkg(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed z-50 focus:outline-none bg-zinc-900 shadow-xl p-4 sm:p-6 w-[calc(100vw-1.5rem)] max-w-lg max-h-[85dvh] overflow-y-auto left-1/2 -translate-x-1/2 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 rounded-xl sm:rounded-md">
            <Dialog.Title className="text-lg font-bold mb-2 text-white">
              Import songs
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-400 mb-4">
              {pendingPkg
                ? `${pendingPkg.songs.length} song(s)` +
                  (pendingPkg.repertoires?.length
                    ? `, ${pendingPkg.repertoires.length} set(s)`
                    : "") +
                  (conflicts.length
                    ? `. ${conflicts.length} title conflict(s) — choose an action.`
                    : ".")
                : ""}
            </Dialog.Description>

            {conflicts.length > 0 ? (
              <ul className="flex flex-col gap-3 mb-4">
                {conflicts.map((c) => {
                  const res = resolutions.find(
                    (r) => r.packageSongId === c.packageSong.id,
                  )
                  return (
                    <li
                      key={c.packageSong.id}
                      className="border border-zinc-700 rounded-md p-3"
                    >
                      <p className="text-sm text-zinc-100 font-medium">
                        {c.packageSong.title}
                      </p>
                      <p className="text-xs text-zinc-500 mb-2">
                        Import: {c.packageSong.artist} · Local:{" "}
                        {c.localSong.artist}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
                        {(
                          [
                            ["skip", "Skip"],
                            ["duplicate", "Duplicate"],
                            ["replace", "Replace"],
                          ] as const
                        ).map(([value, label]) => (
                          <label
                            key={value}
                            className="inline-flex items-center gap-1.5 min-h-9 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`conflict-${c.packageSong.id}`}
                              checked={res?.action === value}
                              onChange={() =>
                                setAction(c.packageSong.id, value)
                              }
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400 mb-4">
                No title conflicts. Songs will be added as new copies.
              </p>
            )}

            {pendingPkg && conflictByPkgId.size < pendingPkg.songs.length ? (
              <p className="text-xs text-zinc-500 mb-4">
                {pendingPkg.songs.length - conflictByPkgId.size} song(s) without
                conflict will be added.
              </p>
            ) : null}

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" variant="cancel" disabled={importing}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                variant="save"
                onClick={() => void applyImport()}
                disabled={importing}
              >
                {importing ? "Importing…" : "Import"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
