import Button from "@/components/ui/Button"

export default function UITest() {
  return (
    <>
      <h2 className="page-title mb-4">UI Test</h2>
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
