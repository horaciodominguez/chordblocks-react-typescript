import {
  DEFAULT_THEME_ID,
  getThemeById,
  isThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/config/themes"

const META_THEME_COLOR = 'meta[name="theme-color"]'

export function readThemePreference(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemeId(stored)) return stored
  } catch {
    /* ignore */
  }

  return DEFAULT_THEME_ID
}

export function writeThemePreference(themeId: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  } catch {
    /* ignore */
  }
}

/** Dark removes data-theme so the DOM matches the pre-theming state. */
export function applyTheme(themeId: ThemeId): void {
  if (typeof document === "undefined") return

  if (themeId === DEFAULT_THEME_ID) {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = themeId
  }

  const theme = getThemeById(themeId)
  const meta = document.querySelector<HTMLMetaElement>(META_THEME_COLOR)
  if (meta) {
    meta.content = theme.preview.canvas
  }
}

export function bootstrapTheme(): ThemeId {
  const themeId = readThemePreference()
  applyTheme(themeId)
  return themeId
}
