import { useEffect } from "react"

/**
 * Keep the screen awake while `enabled` (F13 performance mode).
 * Fails silently when Wake Lock API is unavailable or denied.
 */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return
    }

    let lock: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen")
      } catch {
        // Unsupported, denied, or battery saver — ignore.
      }
    }

    void request()

    const onVisibility = () => {
      if (cancelled) return
      if (document.visibilityState === "visible") {
        void request()
      }
    }

    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisibility)
      void lock?.release().catch(() => {})
      lock = null
    }
  }, [enabled])
}
