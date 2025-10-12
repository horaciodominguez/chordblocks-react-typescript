import React from "react"

type Props = {
  duration: number
  beatsPerMeasure?: number
}

export const Rest: React.FC<Props> = ({ duration, beatsPerMeasure = 4 }) => {
  const ratio = duration / beatsPerMeasure

  let symbol = "𝄽"
  let label = "Quarter rest"
  let type: "whole" | "half" | "quarter" | "eighth" | "sixteenth" = "quarter"

  if (ratio >= 1) {
    symbol = "𝄼"
    label = "Whole rest"
    type = "whole"
  } else if (ratio >= 0.5) {
    symbol = "𝄻"
    label = "Half rest"
    type = "half"
  } else if (ratio >= 0.25) {
    symbol = "𝄽"
    label = "Quarter rest"
    type = "quarter"
  } else if (ratio >= 0.125) {
    symbol = "𝄾"
    label = "Eighth rest"
    type = "eighth"
  } else {
    symbol = "𝄽"
    label = `Rest (${duration} beats)`
    type = "sixteenth"
  }

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center text-2xl`}
      style={{ lineHeight: 1 }}
    >
      <span>
        <picture>
          <svg
            className={` w-[24px] h-[24px]`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <use
              href={`/assets/rests-sprite.svg#${type}-rest`}
              className="text-white"
              fill="currentColor"
              width={24}
              height={24}
            />
          </svg>
        </picture>
      </span>
      <span
        className="sr-only"
        style={{ fontVariantLigatures: "no-common-ligatures" }}
      >
        {symbol}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Rest
