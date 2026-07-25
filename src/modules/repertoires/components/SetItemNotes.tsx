type Props = {
  notes: string
  /** Dense one/two-line cue for Play sticky chrome. */
  compact?: boolean
}

/**
 * Per-set-item cue notes (`RepertoireItem.notes`).
 * Compact variant is meant to sit inside sticky Play chrome (S2.6).
 */
export function SetItemNotes({ notes, compact = false }: Props) {
  const text = notes.trim()
  if (!text) return null

  if (compact) {
    return (
      <p
        role="note"
        aria-label="Set item notes"
        className="text-xs sm:text-sm leading-snug whitespace-pre-wrap line-clamp-2 font-medium text-amber-100 light:text-amber-900 stage:text-white"
      >
        <span className="text-amber-500/90 light:text-amber-700 stage:text-zinc-400 font-bold uppercase tracking-wider text-[9px] mr-1.5">
          Cue
        </span>
        {text}
      </p>
    )
  }

  return (
    <p
      role="note"
      aria-label="Set item notes"
      className="mb-3 text-sm whitespace-pre-wrap text-amber-200/80 bg-amber-400/5 border border-amber-500/20 rounded-md px-3 py-2 light:text-amber-900 light:bg-amber-50 light:border-amber-200"
    >
      {text}
    </p>
  )
}
