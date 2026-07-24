import { useCallback, useEffect, useState } from "react"

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null
  return document.fullscreenElement
}

/** Screen Fullscreen API for Play atril (S2.5). */
export function useFullscreen() {
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (typeof document === "undefined") return
    setSupported(typeof document.documentElement.requestFullscreen === "function")
    const sync = () => setActive(Boolean(getFullscreenElement()))
    sync()
    document.addEventListener("fullscreenchange", sync)
    return () => document.removeEventListener("fullscreenchange", sync)
  }, [])

  const enter = useCallback(async () => {
    if (typeof document === "undefined") return
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      /* denied / unsupported */
    }
  }, [])

  const exit = useCallback(async () => {
    if (typeof document === "undefined" || !document.fullscreenElement) return
    try {
      await document.exitFullscreen()
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(async () => {
    if (getFullscreenElement()) await exit()
    else await enter()
  }, [enter, exit])

  return { active, supported, enter, exit, toggle }
}
