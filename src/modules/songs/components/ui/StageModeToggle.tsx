type Props = {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

/** Play toolbar toggle for high-contrast stage mode (S2.4). */
export function StageModeToggle({ enabled, onChange }: Props) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={enabled ? "Disable stage contrast" : "Enable stage contrast"}
      title={
        enabled
          ? "Stage mode on — high contrast for stage lights"
          : "Stage mode — high contrast for stage lights"
      }
      onClick={() => onChange(!enabled)}
      className={`inline-flex items-center gap-1.5 min-h-9 px-3 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        enabled
          ? "bg-white text-black border border-white"
          : "border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 light:border-zinc-300 light:text-zinc-600 light:hover:text-zinc-900 light:hover:border-zinc-400"
      }`}
    >
      Stage
    </button>
  )
}
