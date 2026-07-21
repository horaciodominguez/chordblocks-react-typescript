import Button from "@/components/ui/Button"
import PageTitle from "@/components/ui/PageTitle"
import Panel from "@/components/ui/Panel"
import EmptyState from "@/components/ui/EmptyState"
import IconButton from "@/components/ui/IconButton"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { Music, Pin, Trash } from "lucide-react"

export default function UITest() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <PageTitle>UI catalog</PageTitle>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-300 light:text-zinc-800">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="save">Save</Button>
          <Button variant="cancel">Cancel</Button>
          <Button variant="delete">Delete</Button>
          <Button variant="save" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex gap-2">
          <IconButton aria-label="Pin">
            <Pin size={16} />
          </IconButton>
          <IconButton variant="danger" aria-label="Delete">
            <Trash size={16} />
          </IconButton>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-300 light:text-zinc-800">Panels</h2>
        <Panel variant="card">Card panel</Panel>
        <Panel variant="flat">Flat panel</Panel>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-300 light:text-zinc-800">States</h2>
        <EmptyState
          icon={<Music size={48} />}
          title="Empty state"
          description="Shared empty pattern for lists."
          actionLabel="Primary action"
          onAction={() => undefined}
        />
        <LoaderSpinner />
      </section>
    </div>
  )
}
