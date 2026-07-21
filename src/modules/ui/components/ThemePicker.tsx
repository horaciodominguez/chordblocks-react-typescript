import { Check } from "lucide-react"
import { THEMES, type ThemeId } from "@/config/themes"
import { useTheme } from "@/modules/ui/hooks/useTheme"

export function ThemePicker() {
  const { themeId, setThemeId } = useTheme()

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {THEMES.map((theme) => {
        const selected = theme.id === themeId

        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setThemeId(theme.id as ThemeId)}
            className={`group relative flex flex-col gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              selected
                ? "border-indigo-500/50 bg-indigo-500/10 light:border-indigo-400 light:bg-indigo-500/15"
                : "border-zinc-700 bg-zinc-50/5 hover:border-zinc-600 light:border-zinc-200 light:bg-white/80 light:hover:border-zinc-300"
            }`}
          >
            <div
              className="overflow-hidden rounded-sm border border-zinc-700 light:border-zinc-200"
              aria-hidden
            >
              <div
                className="flex h-14 items-stretch"
                style={{ backgroundColor: theme.preview.canvas }}
              >
                <div
                  className="m-2 flex-1 rounded-sm border"
                  style={{
                    backgroundColor: theme.preview.surface,
                    borderColor: theme.preview.accent,
                  }}
                />
                <div
                  className="my-2 mr-2 w-8 rounded-sm"
                  style={{ backgroundColor: theme.preview.accent }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-200 light:text-zinc-900">
                {theme.label}
              </span>
              {selected ? (
                <Check
                  size={16}
                  className="shrink-0 text-indigo-400 light:text-indigo-600"
                  aria-hidden
                />
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ThemePicker
