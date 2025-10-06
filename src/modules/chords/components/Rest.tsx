import React from "react"

type Props = {
  /** duración en beats (el mismo número que usás en BarChord.duration) */
  duration: number
  /** opcional: beats por compás (timeSignature.beatsPerMeasure). Si no se pasa, 4 por defecto */
  beatsPerMeasure?: number
  className?: string
}

/**
 * Elige un símbolo de rest según la proporción duration / beatsPerMeasure.
 * - >= 1.0 -> whole rest
 * - >= 0.5 -> half rest
 * - >= 0.25 -> quarter rest
 * - >= 0.125 -> eighth rest
 *
 * Usa símbolos Unicode del bloque "Musical Symbols" como primer recurso.
 * Si la fuente no los soporta, muestra texto descriptivo como fallback (accessible).
 */
export const Rest: React.FC<Props> = ({
  duration,
  beatsPerMeasure = 4,
  className = "",
}) => {
  const ratio = duration / beatsPerMeasure

  // Unicode musical symbols (mucha compatibilidad en sistemas modernos; hay fallback text)
  // whole  𝄼  U+1D13C
  // half   𝄻  U+1D13B
  // quarter 𝄽 U+1D13D
  // eighth  𝄾 U+1D13E
  let symbol = "𝄽" // default quarter rest
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
      {/* accesible fallback (oculto visualmente si querés) */}
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Rest
