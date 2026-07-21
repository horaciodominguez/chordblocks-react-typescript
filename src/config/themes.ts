export const THEMES = [
  {
    id: "dark",
    label: "Dark",
    sonner: "dark" as const,
    preview: {
      canvas: "#0a0a0a",
      surface: "#18181b",
      accent: "#4f46e5",
    },
  },
  {
    id: "light",
    label: "Light",
    sonner: "light" as const,
    preview: {
      canvas: "#eef1f5",
      surface: "#ffffff",
      accent: "#4f46e5",
    },
  },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

export type SonnerTheme = (typeof THEMES)[number]["sonner"]

export const DEFAULT_THEME_ID: ThemeId = "dark"

export const THEME_STORAGE_KEY = "chordblocks:theme"

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}

export function getThemeById(id: ThemeId) {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]
}
