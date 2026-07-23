import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import PageState from "@/components/ui/PageState"
import { RepertoireEditor } from "@/modules/repertoires/components/RepertoireEditor"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import { ROUTES } from "@/config/navigation"
import { touchRepertoire } from "@/modules/repertoires/utils/repertoire.factory"

export default function EditRepertoire() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRepertoire, updateRepertoire, mutating, initialLoading } =
    useRepertoires()

  const repertoire = id ? getRepertoire(id) : undefined

  const handleSave = async (rep: Repertoire) => {
    try {
      await updateRepertoire(touchRepertoire(rep))
      toast.success("Set saved")
      navigate(ROUTES.set(rep.id), { replace: true })
    } catch (err) {
      console.error(err)
      toast.error("Could not save set")
    }
  }

  const parentPath = id ? ROUTES.set(id) : ROUTES.sets

  if (initialLoading) {
    return <PageState variant="loading" backTo={parentPath} />
  }

  if (!repertoire) {
    return (
      <PageState
        variant="notFound"
        message="Set not found"
        backTo={ROUTES.sets}
        backLabel="Back to sets"
      />
    )
  }

  return (
    <>
      <PageHeader title="Edit set" backTo={parentPath} />
      <RepertoireEditor
        initial={repertoire}
        mutating={mutating}
        onSave={handleSave}
        onCancel={() => navigate(ROUTES.set(repertoire.id), { replace: true })}
      />
    </>
  )
}
