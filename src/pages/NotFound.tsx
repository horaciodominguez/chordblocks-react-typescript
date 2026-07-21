import { Link } from "react-router-dom"
import EmptyState from "@/components/ui/EmptyState"
import Button from "@/components/ui/Button"
import { ROUTES } from "@/config/navigation"

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="That route does not exist. Go back to Home, Songs, or Sets."
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Link to={ROUTES.home}>
            <Button type="button" variant="save" className="min-h-11">
              Home
            </Button>
          </Link>
          <Link to={ROUTES.songs}>
            <Button type="button" variant="primary" className="min-h-11">
              Songs
            </Button>
          </Link>
          <Link to={ROUTES.sets}>
            <Button type="button" variant="primary" className="min-h-11">
              Sets
            </Button>
          </Link>
        </div>
      }
    />
  )
}
