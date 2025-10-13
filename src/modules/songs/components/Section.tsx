import type { TimeSignature } from "../types/song.types"

import type { SongSection } from "../types/section.types"
import SectionBars from "@/modules/songs/components/ui/SectionBars"

import SectionBlocks from "./ui/SectionBlocks"
import { Block } from "./Block"
import { Repeat } from "./ui/Repeat"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
  showDiagram?: boolean
}

export const Section = ({ section, timeSignature, showDiagram }: Props) => {
  return (
    <SectionBars id={section.id} section={section}>
      {section.bars.map((bar, index) => {
        const isLastBar = index === section.bars.length - 1
        return (
          <SectionBlocks key={bar.id}>
            {bar.blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                timeSignature={timeSignature}
                showDiagram={showDiagram}
              />
            ))}
            {/* si es el último compás y hay repeticiones */}
            {isLastBar && section.repeats && section.repeats > 1 && (
              <Repeat repeats={section.repeats} />
            )}
          </SectionBlocks>
        )
      })}
    </SectionBars>
  )
}
