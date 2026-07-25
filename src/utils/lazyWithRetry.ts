import { lazy, type ComponentType, type LazyExoticComponent } from "react"

const RELOAD_KEY = "chordblocks:lazy-chunk-reload"

/**
 * React.lazy that recovers once from stale Vite chunk URLs
 * (e.g. tab still pointing at an old port like :5175 after the dev server moved).
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const mod = await factory()
      sessionStorage.removeItem(RELOAD_KEY)
      return mod
    } catch (err) {
      const alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === "1"
      const message = err instanceof Error ? err.message : String(err)
      const isChunkError =
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Loading chunk") ||
        message.includes("Importing a module script failed")

      if (isChunkError && !alreadyReloaded && typeof window !== "undefined") {
        sessionStorage.setItem(RELOAD_KEY, "1")
        window.location.reload()
        return new Promise(() => {})
      }

      throw err
    }
  })
}
