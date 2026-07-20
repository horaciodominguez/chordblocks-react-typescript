type Props = {
  label?: string
}

/** Compact text marker for a riff placeholder block (Keep-style). */
export function RiffMarker({ label }: Props) {
  const text = label?.trim() || "Riff"
  return (
    <span
      className="block-marker-riff inline-flex items-center justify-center text-amber-300/90 font-semibold uppercase tracking-wide text-xs sm:text-sm"
      title={text}
      aria-label={text}
    >
      {text}
    </span>
  )
}

export default RiffMarker
