import type { TimeSignature } from "@/modules/songs/types/song.types"
import type { SongDensity } from "@/modules/songs/types/density.types"
import { Fragment } from "react"

import SectionBars from "@/modules/songs/components/ui/SectionBars"
import type { SongSection } from "@/modules/songs/types/section.types"

import { Block } from "./Block"
import { BarSeparator } from "./ui/BarSeparator"
import { Repeat } from "./ui/Repeat"
import SectionBlocks from "./ui/SectionBlocks"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
  showDiagram?: boolean
  density?: SongDensity
}

export const Section = ({
  section,
  timeSignature,
  showDiagram,
  density = "bars",
}: Props) => {
  return (
    <SectionBars id={section.id} section={section} density={density}>
      {section.bars.map((bar, index) => {
        const isLastBar = index === section.bars.length - 1
        return (
          <SectionBlocks key={bar.id} showMeasureSeparator={!isLastBar}>
            {bar.blocks.map((block, blockIndex) => (
              <Fragment key={block.id}>
                {blockIndex > 0 && <BarSeparator />}
                <Block
                  block={block}
                  timeSignature={timeSignature}
                  showDiagram={showDiagram}
                  density={density}
                />
              </Fragment>
            ))}
            {isLastBar && section.repeats && section.repeats > 1 && (
              <Repeat repeats={section.repeats} />
            )}
          </SectionBlocks>
        )
      })}
    </SectionBars>
  )
}
