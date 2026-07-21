import { useCallback, useSyncExternalStore } from "react"
import {
  DEFAULT_THEME_ID,
  getThemeById,
  type SonnerTheme,
  type ThemeId,
} from "@/config/themes"
import {
  applyTheme,
  readThemePreference,
  writeThemePreference,
} from "@/modules/ui/themePreference"

let currentThemeId =
  typeof window !== "undefined" ? readThemePreference() : DEFAULT_THEME_ID
const listeners = new Set<() => void>()

function emitThemeChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentThemeId
}

function setTheme(themeId: ThemeId) {
  if (themeId === currentThemeId) return

  currentThemeId = themeId
  writeThemePreference(themeId)
  applyTheme(themeId)
  emitThemeChange()
}

export function useTheme() {
  const themeId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_THEME_ID,
  )

  const setThemeId = useCallback((next: ThemeId) => {
    setTheme(next)
  }, [])

  const theme = getThemeById(themeId)

  return {
    themeId,
    theme,
    sonnerTheme: theme.sonner as SonnerTheme,
    setThemeId,
  }
}
