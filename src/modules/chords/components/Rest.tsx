import React from "react"

type Props = {
  duration: number
  beatsPerMeasure?: number
  className?: string
}

export const Rest: React.FC<Props> = ({
  duration,
  beatsPerMeasure = 4,
  className = "",
}) => {
  const ratio = duration / beatsPerMeasure

  let symbol = "𝄽"
  let label = "Quarter rest"

  if (ratio >= 1) {
    symbol = "𝄼"
    label = "Whole rest"
  } else if (ratio >= 0.5) {
    symbol = "𝄻"
    label = "Half rest"
  } else if (ratio >= 0.25) {
    symbol = "𝄽"
    label = "Quarter rest"
  } else if (ratio >= 0.125) {
    symbol = "𝄾"
    label = "Eighth rest"
  } else {
    symbol = "𝄽"
    label = `Rest (${duration} beats)`
  }

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ lineHeight: 1 }}
    >
      <span style={{ fontVariantLigatures: "no-common-ligatures" }}>
        {symbol}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Rest
