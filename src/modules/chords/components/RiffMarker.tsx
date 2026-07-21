type Props = {
  label?: string
}

/** Compact text marker for a riff placeholder block (Keep-style). */
export function RiffMarker({ label }: Props) {
  const text = label?.trim() || "Riff"
  return (
    <span
      className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-amber-300/90 sm:text-sm guide:text-[10px] guide:tracking-wide"
      title={text}
      aria-label={text}
    >
      {text}
    </span>
  )
}

export default RiffMarker
