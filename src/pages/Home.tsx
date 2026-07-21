import { Link, useNavigate } from "react-router-dom"
import PageTitle from "@/components/ui/PageTitle"
import EmptyState from "@/components/ui/EmptyState"
import Panel from "@/components/ui/Panel"
import Button from "@/components/ui/Button"
import { useRepertoires } from "@/modules/repertoires/hooks/useRepertoires"
import {
  countRepertoireItems,
  formatRepertoireDate,
  getPinnedRepertoires,
} from "@/modules/repertoires/utils/repertoire.catalog"
import { ROUTES } from "@/config/navigation"
import { ListMusic, Pin } from "lucide-react"

export default function Home() {
  const navigate = useNavigate()
  const { repertoires } = useRepertoires()
  const pinned = getPinnedRepertoires(repertoires)

  return (
    <>
      <PageTitle>Home</PageTitle>

      {pinned.length === 0 ? (
        <EmptyState
          icon={<Pin size={48} />}
          title="No pinned sets"
          description="Pin the sets you need this week from Sets. They will show up here, sorted by date."
          action={
            <Button
              type="button"
              variant="save"
              className="min-h-11 inline-flex items-center gap-2 mx-auto"
              onClick={() => navigate(ROUTES.sets)}
            >
              <ListMusic size={16} />
              Browse sets
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-zinc-300">Pinned sets</h2>
            <Link
              to={ROUTES.sets}
              className="text-sm text-indigo-400 hover:text-indigo-300 min-h-11 inline-flex items-center"
            >
              View all sets
            </Link>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pinned.map((rep) => {
              const itemCount = countRepertoireItems(rep)
              const dateLabel = formatRepertoireDate(rep.date)
              return (
                <li key={rep.id} className="min-w-0">
                  <Panel variant="card">
                    <Link
                      to={ROUTES.set(rep.id)}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-zinc-100 truncate flex items-center gap-2">
                          <Pin
                            size={16}
                            className="text-amber-400 shrink-0"
                            aria-hidden
                          />
                          {rep.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">
                          {itemCount} {itemCount === 1 ? "song" : "songs"}
                          {dateLabel ? ` · ${dateLabel}` : ""}
                        </p>
                      </div>
                    </Link>
                  </Panel>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
