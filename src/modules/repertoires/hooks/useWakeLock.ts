import { useEffect, useState } from "react"

export type WakeLockStatus = {
  /** True while a screen wake lock is currently held. */
  active: boolean
  /** False when the Wake Lock API is missing in this browser. */
  supported: boolean
}

/**
 * Keep the screen awake while `enabled` (Play / atril mode).
 * Returns status so the UI can show a visible keep-awake indicator.
 */
export function useWakeLock(enabled: boolean): WakeLockStatus {
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(() =>
    typeof navigator !== "undefined" && "wakeLock" in navigator,
  )

  useEffect(() => {
    if (!enabled) {
      setActive(false)
      return
    }

    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      setSupported(false)
      setActive(false)
      return
    }

    setSupported(true)

    let lock: WakeLockSentinel | null = null
    let cancelled = false

    const clearLock = () => {
      if (lock) {
        lock.onrelease = null
        lock = null
      }
      setActive(false)
    }

    const request = async () => {
      try {
        const next = await navigator.wakeLock.request("screen")
        if (cancelled) {
          void next.release().catch(() => {})
          return
        }
        if (lock && lock !== next) {
          void lock.release().catch(() => {})
        }
        lock = next
        lock.onrelease = () => {
          if (lock === next) {
            lock = null
            setActive(false)
          }
        }
        setActive(true)
      } catch {
        // Unsupported in this context, denied, or battery saver.
        clearLock()
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
      const current = lock
      lock = null
      setActive(false)
      if (current) {
        current.onrelease = null
        void current.release().catch(() => {})
      }
    }
  }, [enabled])

  return { active, supported }
}
