import type { SongSection } from "@/modules/songs/types/section.types"
import { Repeat } from "lucide-react"

function setBarsByLine(section: SongSection) {
  let maxChords = 0
  section.bars.map((bar) => {
    const len = bar.blocks.length
    if (len > maxChords) return (maxChords = len)
  })
  if (maxChords >= 1) return 4
  if (maxChords >= 4) return 3
  if (maxChords >= 6 && maxChords <= 8) return 2
  return 1
}

interface Props {
  id?: string
  section: SongSection
  children: React.ReactNode
}

export default function SectionBars({ children, section }: Props) {
  const gridPerMueasureValue = setBarsByLine(section)
  const classBars = `SECTIONBARS-WRAP grid divide-x-2 divide-blue-300 gap-2 mb-4 ${
    gridPerMueasureValue === 1
      ? "grid-cols-1"
      : gridPerMueasureValue === 2
      ? "grid-cols-2"
      : gridPerMueasureValue === 3
      ? "grid-cols-3"
      : gridPerMueasureValue === 4
      ? "grid-cols-4"
      : ""
  }`
  return (
    <>
      <div className={classBars}>
        {children}
        {section.repeats && section.repeats > 1 && (
          <div className="flex justify-center items-center">
            <Repeat className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  )
}
