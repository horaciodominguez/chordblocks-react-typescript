import type { SongSection } from "@/modules/songs/types/section.types"
import type { SongDensity } from "@/modules/songs/types/density.types"
import {
  maxBlocksPerBar,
  sectionBarsColClass,
  setBarsByLine,
} from "@/modules/songs/components/ui/sectionBarsLayout"

interface Props {
  id?: string
  section: SongSection
  children: React.ReactNode
  density?: SongDensity
}

export default function SectionBars({
  children,
  section,
  density = "bars",
}: Props) {
  const cols = setBarsByLine(section)
  const maxChords = maxBlocksPerBar(section)
  const colClass = sectionBarsColClass(cols, density, maxChords)

  return (
    <div
      className={`grid ${colClass} gap-x-2 gap-y-4 mb-4 guide:gap-x-3 guide:gap-y-3 guide:mb-3`}
    >
      {children}
    </div>
  )
}
