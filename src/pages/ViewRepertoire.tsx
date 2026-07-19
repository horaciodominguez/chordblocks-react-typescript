import { Link, useNavigate, useParams } from "react-router-dom"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import { PageHeader } from "@/components/layout/PageHeader"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import Button from "@/components/ui/Button"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { formatTransposePreview } from "@/modules/repertoires/utils/repertoire.transposePreview"

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
    return (
      <>
        <PageHeader title="Loading…" backTo="/repertoires" />
        <LoaderSpinner />
      </>
    )
  }

  if (!repertoire) {
    return (
      <>
        <PageHeader title="Not found" backTo="/repertoires" />
        <div className="text-center py-6">Set not found</div>
      </>
    )
  }

  const flatItems = repertoire.groups.flatMap((g) =>
    g.items.map((item) => ({ group: g, item })),
  )

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
    await updateRepertoire({ ...repertoire, title: next })
    setEditingTitle(false)
    toast.success("Title updated")
  }

  return (
    <>
      <PageHeader title={repertoire.title} backTo="/repertoires" />

      <div className="panel-variant-1 flex flex-col gap-4 mb-4">
        {editingTitle ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 min-h-11 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-zinc-100"
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
            </p>
            <div className="flex flex-wrap gap-2">
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
                onClick={() => navigate(`/repertoires/${repertoire.id}/edit`)}
              >
                Edit set
              </Button>
            </div>
          </div>
        )}
      </div>

      {flatItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-500 mb-4">No songs in this set yet.</p>
          <Button
            type="button"
            variant="save"
            className="min-h-11"
            onClick={() => navigate(`/repertoires/${repertoire.id}/edit`)}
          >
            Add songs
          </Button>
        </div>
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
                          className="panel-variant-1 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="text-zinc-500 mr-2">
                              {index + 1}.
                            </span>
                            {song ? (
                              <Link
                                to={`/song/${song.id}?repertoireId=${repertoire.id}&itemId=${item.id}`}
                                className="text-zinc-100 font-medium hover:text-indigo-300"
                              >
                                {song.title}
                              </Link>
                            ) : (
                              <span className="text-zinc-500 italic">
                                Missing song ({item.songId.slice(0, 8)}…)
                              </span>
                            )}
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

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          className="min-h-11"
          onClick={() => navigate(`/repertoires/${repertoire.id}/edit`)}
        >
          Edit set
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11"
          onClick={() => navigate("/repertoires")}
        >
          Back to sets
        </Button>
      </div>
    </>
  )
}
