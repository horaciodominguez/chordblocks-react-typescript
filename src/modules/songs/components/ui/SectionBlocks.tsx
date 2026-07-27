interface Props {
  children: React.ReactNode
  /** Draw a vertical line after this measure (all except the last in the section). */
  showMeasureSeparator?: boolean
  /** First bar is an anacrusis (shorter / dashed cue). */
  isPickup?: boolean
}

const measureSeparatorClass =
  "after:pointer-events-none after:absolute after:top-1 after:right-0 after:bottom-1 after:w-0.5 after:bg-blue-400 after:content-[''] light:after:bg-blue-500 stage:after:bg-white/70"

const pickupClass =
  "pl-2 border-l-2 border-dashed border-violet-500/50 light:border-violet-400/70 stage:border-white/50"

export default function SectionBlocks({
  children,
  showMeasureSeparator = false,
  isPickup = false,
}: Props) {
  return (
    <div
      className={`relative flex w-full items-stretch py-2 min-w-0 guide:min-w-min guide:py-1.5 guide:pr-2 ${
        showMeasureSeparator ? measureSeparatorClass : ""
      } ${isPickup ? pickupClass : ""}`}
    >
      {children}
    </div>
  )
}
