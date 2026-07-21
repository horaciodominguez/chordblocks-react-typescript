import { Link, useNavigate, useParams } from "react-router-dom"
import { Download, Pin, PinOff } from "lucide-react"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { PageHeader } from "@/components/layout/PageHeader"
import PageState from "@/components/ui/PageState"
import EmptyState from "@/components/ui/EmptyState"
import Panel from "@/components/ui/Panel"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import IconButton from "@/components/ui/IconButton"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { formatTransposePreview } from "@/modules/repertoires/utils/repertoire.transposePreview"
import {
  flattenRepertoireItems,
  setSongPath,
} from "@/modules/repertoires/utils/repertoire.navigation"
import { buildExportPackage } from "@/modules/io/utils/buildExportPackage"
import { downloadJson, exportFilename } from "@/modules/io/utils/downloadJson"
import { removeItem } from "@/modules/repertoires/utils/repertoire.edit"
import { touchRepertoire } from "@/modules/repertoires/utils/repertoire.factory"
import { formatRepertoireDate } from "@/modules/repertoires/utils/repertoire.catalog"
import { ROUTES } from "@/config/navigation"

export default function ViewRepertoire() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRepertoire, updateRepertoire, mutating, initialLoading } =
    useRepertoires()
  const { songs } = useSongs()
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState("")

  const repertoire = id ? getRepertoire(id) : undefined

  const songById = useMemo(() => {
    const map = new Map(songs.map((s) => [s.id, s]))
    return map
  }, [songs])

  if (initialLoading) {
    return <PageState variant="loading" backTo={ROUTES.sets} />
  }

  if (!repertoire) {
    return (
      <PageState
        variant="notFound"
        message="Set not found"
        backTo={ROUTES.sets}
        backLabel="Back to sets"
        secondaryTo={ROUTES.home}
        secondaryLabel="Home"
      />
    )
  }

  const flatItems = repertoire.groups.flatMap((g) =>
    g.items.map((item) => ({ group: g, item })),
  )
  const missingCount = flatItems.filter(
    ({ item }) => !songById.has(item.songId),
  ).length
  const dateLabel = formatRepertoireDate(repertoire.date)
  const pinned = Boolean(repertoire.isPinned)

  const startPlay = () => {
    const first = flattenRepertoireItems(repertoire)[0]
    if (!first) {
      toast.error("Add songs to the set first")
      return
    }
    navigate(
      setSongPath(first.item.songId, repertoire.id, first.item.id, {
        mode: "play",
      }),
    )
  }

  const exportSet = () => {
    try {
      const pkg = buildExportPackage({
        repertoires: [repertoire],
        allSongs: songs,
      })
      const safe =
        repertoire.title
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
      toast.error("Export failed — add songs to the set first")
    }
  }

  const startRename = () => {
    setTitleDraft(repertoire.title)
    setEditingTitle(true)
  }

  const saveTitle = async () => {
    const next = titleDraft.trim()
    if (!next) {
      toast.error("Title is required")
      return
    }
    await updateRepertoire(touchRepertoire({ ...repertoire, title: next }))
    setEditingTitle(false)
    toast.success("Title updated")
  }

  const togglePin = async () => {
    try {
      const nextPinned = !pinned
      await updateRepertoire(
        touchRepertoire({
          ...repertoire,
          isPinned: nextPinned || undefined,
        }),
      )
      toast.success(nextPinned ? "Set pinned" : "Set unpinned")
    } catch {
      toast.error("Could not update pin")
    }
  }

  const removeMissing = async () => {
    let next = repertoire
    for (const { item } of flatItems) {
      if (!songById.has(item.songId)) {
        next = removeItem(next, item.id)
      }
    }
    await updateRepertoire(touchRepertoire(next))
    toast.success("Removed missing song references")
  }

  return (
    <>
      <PageHeader
        title={repertoire.title}
        backTo={ROUTES.sets}
        actions={
          <IconButton
            aria-label={pinned ? "Unpin set" : "Pin set"}
            aria-pressed={pinned}
            onClick={togglePin}
            disabled={mutating}
            className={pinned ? "text-amber-400 border-amber-500/40" : ""}
          >
            {pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </IconButton>
        }
      />

      <Panel variant="flat" className="flex flex-col gap-4 mb-4">
        {editingTitle ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              name="rename-set"
              alwaysEditable
              className="flex-1"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              aria-label="Set title"
            />
            <Button
              type="button"
              variant="save"
              className="min-h-11"
              onClick={saveTitle}
              disabled={mutating}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="cancel"
              className="min-h-11"
              onClick={() => setEditingTitle(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-zinc-400">
              {flatItems.length}{" "}
              {flatItems.length === 1 ? "song" : "songs"} in this set
              {dateLabel ? ` · ${dateLabel}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="save"
                className="min-h-11"
                onClick={startPlay}
                disabled={flatItems.length === 0}
              >
                Play
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={startRename}
              >
                Rename
              </Button>
              <Button
                type="button"
                variant="primary"
                className="min-h-11"
                onClick={() => navigate(ROUTES.setEdit(repertoire.id))}
              >
                Edit set
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 inline-flex items-center gap-2"
                onClick={exportSet}
                disabled={flatItems.length === 0}
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
        )}
      </Panel>

      {missingCount > 0 ? (
        <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-400/5 px-3 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-amber-200/90">
            {missingCount} missing song
            {missingCount === 1 ? "" : "s"} in this set.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={removeMissing}
              disabled={mutating}
            >
              Remove broken refs
            </Button>
            <Button
              type="button"
              variant="primary"
              className="min-h-11"
              onClick={() => navigate(ROUTES.setEdit(repertoire.id))}
            >
              Edit set
            </Button>
          </div>
        </div>
      ) : null}

      {flatItems.length === 0 ? (
        <EmptyState
          title="No songs in this set yet"
          description="Add songs from your library to start playing."
          actionLabel="Add songs"
          onAction={() => navigate(ROUTES.setEdit(repertoire.id))}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {(() => {
            let running = 0
            return repertoire.groups.map((group) => {
              if (group.items.length === 0) return null
              const baseIndex = running
              running += group.items.length
              return (
                <section key={group.id} className="flex flex-col gap-2">
                  {group.title.trim() ? (
                    <h2 className="text-xs uppercase tracking-wide text-zinc-500 px-1">
                      {group.title}
                    </h2>
                  ) : null}
                  <ol className="flex flex-col gap-2">
                    {group.items.map((item, i) => {
                      const song = songById.get(item.songId)
                      const index = baseIndex + i
                      return (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-zinc-700 bg-zinc-50/5 p-4"
                        >
                          <div className="min-w-0">
                            <span className="text-zinc-500 mr-2">
                              {index + 1}.
                            </span>
                            {song ? (
                              <Link
                                to={setSongPath(
                                  song.id,
                                  repertoire.id,
                                  item.id,
                                )}
                                className="text-zinc-100 font-medium hover:text-indigo-300"
                              >
                                {song.title}
                              </Link>
                            ) : (
                              <span className="text-zinc-500 italic">
                                Missing song ({item.songId.slice(0, 8)}…)
                              </span>
                            )}
                            {item.notes?.trim() ? (
                              <span className="block text-xs text-amber-200/70 mt-0.5 truncate">
                                {item.notes.trim()}
                              </span>
                            ) : null}
                          </div>
                          {item.transposeSemitones !== 0 ? (
                            <span className="text-xs text-amber-400 shrink-0">
                              {formatTransposePreview(
                                song,
                                item.transposeSemitones,
                              ) ??
                                `${item.transposeSemitones > 0 ? "+" : ""}${item.transposeSemitones}`}
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ol>
                </section>
              )
            })
          })()}
        </div>
      )}
    </>
  )
}
