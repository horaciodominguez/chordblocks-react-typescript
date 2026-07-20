import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { RepertoireEditor } from "@/modules/repertoires/components/RepertoireEditor"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

export default function EditRepertoire() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRepertoire, updateRepertoire, mutating, initialLoading } =
    useRepertoires()

  const repertoire = id ? getRepertoire(id) : undefined

  const handleSave = async (rep: Repertoire) => {
    try {
      await updateRepertoire(rep)
      toast.success("Set saved")
      navigate(`/repertoires/${rep.id}`, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error("Could not save set")
    }
  }

  const parentPath = id ? `/repertoires/${id}` : "/repertoires"

  if (initialLoading) {
    return (
      <>
        <PageHeader title="Edit set" backTo={parentPath} />
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

  return (
    <>
      <PageHeader title="Edit set" backTo={parentPath} />
      <RepertoireEditor
        initial={repertoire}
        mutating={mutating}
        onSave={handleSave}
        onCancel={() =>
          navigate(`/repertoires/${repertoire.id}`, { replace: true })
        }
      />
    </>
  )
}
