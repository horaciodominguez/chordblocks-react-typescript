import { Navigate, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useGigLock } from "@/modules/repertoires/context/GigLockContext"
import { ROUTES } from "@/config/navigation"

type Props = {
  children: React.ReactNode
}

/**
 * Blocks create/edit routes while gig lock is on (S2.8).
 * Redirects home and shows a toast once per navigation attempt.
 */
export function GigLockGuard({ children }: Props) {
  const { locked } = useGigLock()
  const location = useLocation()
  const toastedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!locked) {
      toastedFor.current = null
      return
    }
    const key = location.pathname
    if (toastedFor.current === key) return
    toastedFor.current = key
    toast.message("Gig lock is on — hold the lock icon to unlock")
  }, [locked, location.pathname])

  if (locked) {
    return <Navigate to={ROUTES.songs} replace />
  }

  return <>{children}</>
}
