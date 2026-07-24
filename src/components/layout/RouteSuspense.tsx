import { Suspense, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary"

function RouteFallback() {
  return (
    <div className="flex justify-center items-center py-16 min-h-[40vh]">
      <LoaderSpinner />
    </div>
  )
}

/** Suspense + error boundary scoped to the current route. */
export function RouteSuspense({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <RouteErrorBoundary resetKey={pathname}>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </RouteErrorBoundary>
  )
}
