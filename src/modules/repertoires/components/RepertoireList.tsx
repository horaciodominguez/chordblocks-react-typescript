import { Link, useNavigate } from "react-router-dom"
import { ListMusic, Pin, PinOff, Plus, Search, Trash } from "lucide-react"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import Panel from "@/components/ui/Panel"
import EmptyState from "@/components/ui/EmptyState"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import IconButton from "@/components/ui/IconButton"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import {
  countRepertoireItems,
  filterRepertoires,
  formatRepertoireDate,
  getPinnedRepertoires,
  getUnpinnedRepertoires,
} from "@/modules/repertoires/utils/repertoire.catalog"
import { ROUTES } from "@/config/navigation"
import { touchRepertoire } from "@/modules/repertoires/utils/repertoire.factory"

function SetCard({
  rep,
  mutating,
  onTogglePin,
  onDelete,
}: {
  rep: Repertoire
  mutating: boolean
  onTogglePin: (rep: Repertoire) => void
  onDelete: (rep: Repertoire) => Promise<void>
}) {
  const itemCount = countRepertoireItems(rep)
  const dateLabel = formatRepertoireDate(rep.date)
  const pinned = Boolean(rep.isPinned)

  return (
    <Panel variant="card">
      <div className="flex items-start justify-between gap-3">
        <Link to={ROUTES.set(rep.id)} className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-zinc-100 truncate flex items-center gap-2">
            {pinned ? (
              <Pin size={16} className="text-amber-400 shrink-0" aria-hidden />
            ) : null}
            {rep.title}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {itemCount} {itemCount === 1 ? "song" : "songs"}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </p>
        </Link>
        <div className="flex gap-2 shrink-0">
          <IconButton
            aria-label={pinned ? `Unpin ${rep.title}` : `Pin ${rep.title}`}
            aria-pressed={pinned}
            onClick={() => onTogglePin(rep)}
            disabled={mutating}
            className={pinned ? "text-amber-400 border-amber-500/40" : ""}
          >
            {pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </IconButton>
          <ConfirmDialog
            title="Delete set?"
            description={`Delete "${rep.title}"? This cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(rep)}
            trigger={
              <IconButton
                variant="danger"
                aria-label={`Delete ${rep.title}`}
                disabled={mutating}
              >
                <Trash size={16} />
              </IconButton>
            }
          />
        </div>
      </div>
    </Panel>
  )
}

export function RepertoireList() {
  const {
    repertoires,
    mutating,
    addRepertoire,
    deleteRepertoire,
    updateRepertoire,
  } = useRepertoires()
  const { songs } = useSongs()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () => filterRepertoires(repertoires, search, songs),
    [repertoires, search, songs],
  )
  const pinned = useMemo(() => getPinnedRepertoires(filtered), [filtered])
  const unpinned = useMemo(() => getUnpinnedRepertoires(filtered), [filtered])

  const handleCreate = async () => {
    try {
      const created = await addRepertoire("New set")
      toast.success("Set created")
      navigate(ROUTES.set(created.id))
    } catch (err) {
      console.error(err)
      toast.error("Could not create set")
    }
  }

  const handleTogglePin = async (rep: Repertoire) => {
    try {
      const nextPinned = !rep.isPinned
      await updateRepertoire(
        touchRepertoire({ ...rep, isPinned: nextPinned || undefined }),
      )
      toast.success(nextPinned ? "Set pinned" : "Set unpinned")
    } catch (err) {
      console.error(err)
      toast.error("Could not update pin")
    }
  }

  const handleDelete = async (rep: Repertoire) => {
    await deleteRepertoire(rep.id)
    toast.success("Set deleted")
  }

  if (!repertoires.length) {
    return (
      <EmptyState
        icon={<ListMusic size={48} />}
        title="No sets yet"
        description="Create a set for your next gig night."
        action={
          <Button
            type="button"
            variant="save"
            className="min-h-11 inline-flex items-center gap-2 mx-auto"
            onClick={handleCreate}
            disabled={mutating}
          >
            <Plus size={16} />
            Create your first set
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 w-full min-w-0">
          <Input
            name="set-search"
            value={search}
            placeholder="Search sets, songs, or artists"
            icon={<Search size={16} />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="primary"
          className="inline-flex items-center gap-2 shrink-0"
          onClick={handleCreate}
          disabled={mutating}
        >
          <Plus size={16} />
          New set
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">
          No sets match your search.
        </p>
      ) : (
        <>
          {pinned.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-zinc-300 px-1">Pinned</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pinned.map((rep) => (
                  <li key={rep.id} className="min-w-0">
                    <SetCard
                      rep={rep}
                      mutating={mutating}
                      onTogglePin={handleTogglePin}
                      onDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-zinc-300 px-1">
              {pinned.length > 0 ? "All other sets" : "All sets"}
            </h2>
            {unpinned.length === 0 ? (
              <p className="text-sm text-zinc-500 px-1">
                {pinned.length > 0
                  ? "Every matching set is pinned."
                  : "No unpinned sets."}
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unpinned.map((rep) => (
                  <li key={rep.id} className="min-w-0">
                    <SetCard
                      rep={rep}
                      mutating={mutating}
                      onTogglePin={handleTogglePin}
                      onDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
