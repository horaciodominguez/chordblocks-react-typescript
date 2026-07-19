import { Link, useNavigate } from "react-router-dom"
import { ListMusic, Plus, Trash } from "lucide-react"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import PanelContainer from "@/components/ui/PanelContainer"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import Button from "@/components/ui/Button"
import { toast } from "sonner"

function countItems(groups: { items: unknown[] }[]) {
  return groups.reduce((n, g) => n + g.items.length, 0)
}

export function RepertoireList() {
  const {
    repertoires,
    initialLoading,
    mutating,
    addRepertoire,
    deleteRepertoire,
  } = useRepertoires()
  const navigate = useNavigate()

  const handleCreate = async () => {
    try {
      const created = await addRepertoire("New set")
      toast.success("Set created")
      navigate(`/repertoires/${created.id}`)
    } catch (err) {
      console.error(err)
      toast.error("Could not create set")
    }
  }

  if (initialLoading) return <LoaderSpinner />

  if (!repertoires.length) {
    return (
      <div className="text-center py-12 px-4">
        <ListMusic size={48} className="mx-auto mb-4 text-zinc-600" />
        <p className="mb-2 text-lg text-gray-200">No sets yet</p>
        <p className="mb-6 text-sm text-zinc-500">
          Create a repertoire for your next gig night.
        </p>
        <Button
          type="button"
          variant="save"
          className="min-h-11 inline-flex items-center gap-2"
          onClick={handleCreate}
          disabled={mutating}
        >
          <Plus size={16} />
          Create your first set
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          className="min-h-11 inline-flex items-center gap-2"
          onClick={handleCreate}
          disabled={mutating}
        >
          <Plus size={16} />
          New set
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {repertoires.map((rep) => {
          const itemCount = countItems(rep.groups)
          return (
            <li key={rep.id}>
              <PanelContainer>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/repertoires/${rep.id}`}
                    className="flex-1 min-w-0"
                  >
                    <h2 className="text-base font-semibold text-zinc-100 truncate">
                      {rep.title}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      {itemCount} {itemCount === 1 ? "song" : "songs"}
                      {rep.date ? ` · ${rep.date}` : ""}
                    </p>
                  </Link>
                  <ConfirmDialog
                    title="Delete set?"
                    description={`Delete "${rep.title}"? This cannot be undone.`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={async () => {
                      await deleteRepertoire(rep.id)
                      toast.success("Set deleted")
                    }}
                    trigger={
                      <button
                        type="button"
                        aria-label={`Delete ${rep.title}`}
                        className="flex justify-center items-center min-h-11 min-w-11 border border-zinc-700 rounded-md text-red-400 hover:text-red-300"
                        disabled={mutating}
                      >
                        <Trash size={16} />
                      </button>
                    }
                  />
                </div>
              </PanelContainer>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
