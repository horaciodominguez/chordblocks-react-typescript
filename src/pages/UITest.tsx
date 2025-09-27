import Button from "@/components/ui/Button"
import PageTitle from "@/components/ui/PageTitle"

export default function UITest() {
  return (
    <>
      <PageTitle>UI Test</PageTitle>
      <div className="flex flex-row gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="save">Save</Button>
        <Button variant="cancel">Cancel</Button>
        <Button variant="delete">Delete</Button>
      </div>
    </>
  )
}
