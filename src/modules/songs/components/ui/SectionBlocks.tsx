interface Props {
  children: React.ReactNode
  /** Draw a vertical line after this measure (all except the last in the section). */
  showMeasureSeparator?: boolean
}

const measureSeparatorClass =
  "after:pointer-events-none after:absolute after:top-1 after:right-0 after:bottom-1 after:w-0.5 after:bg-blue-400 after:content-[''] light:after:bg-blue-500"

export default function SectionBlocks({
  children,
  showMeasureSeparator = false,
}: Props) {
  return (
    <div
      className={`relative flex min-w-0 w-full items-stretch py-2 guide:py-1 ${
        showMeasureSeparator ? measureSeparatorClass : ""
      }`}
    >
      {children}
    </div>
  )
}
