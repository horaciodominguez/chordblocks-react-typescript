import type { SongSection } from "@/modules/songs/types/section.types"

function setBarsByLine(section: SongSection) {
  let maxChords = 0
  for (const bar of section.bars) {
    if (bar.blocks.length > maxChords) maxChords = bar.blocks.length
  }
  // Fewer columns when bars have more chords (avoids cramped layout)
  if (maxChords >= 6) return 1
  if (maxChords >= 4) return 2
  if (maxChords >= 2) return 3
  return 4
}

interface Props {
  id?: string
  section: SongSection
  children: React.ReactNode
}

export default function SectionBars({ children, section }: Props) {
  const cols = setBarsByLine(section)
  const colClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"

  return (
    <div
      className={`SECTIONBARS-WRAP grid divide-x-0 sm:divide-x-2 divide-blue-300 gap-y-2 mb-4 ${colClass}`}
    >
      {children}
    </div>
  )
}
