import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import SortableItemWrapper from "./SortableItemWrapper"
import { useReorder } from "./useReorder"
import ChordsReorder2 from "./ChordsReorder2"

import { type Bar } from "../../types/bar.types"
import { barWidthByTS } from "@/utils/widthByTS"
import type { TimeSignature } from "../../types/song.types"

type Props = {
  sectionId: string
  bars: Bar[]
  timeSignature: TimeSignature
  onReorder: (bars: Bar[]) => void
  onReorderChords: (
    barId: string,
    chords: { id: string; name: string }[]
  ) => void
}

export default function BarsReorder({
  sectionId,
  bars,
  timeSignature,
  onReorder,
  onReorderChords,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = useReorder(bars, onReorder)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        id={sectionId}
        className="flex flex-wrap divide-x-2 divide-blue-300 mb-4"
      >
        <SortableContext
          items={bars.map((b) => b.id)}
          strategy={horizontalListSortingStrategy}
        >
          {bars.map((bar) => {
            const width =
              barWidthByTS(timeSignature.beatsPerMeasure) == "25%"
                ? "1/4"
                : "1/3"
            return (
              <SortableItemWrapper
                key={bar.id}
                id={bar.id}
                className={`flex  mb-4 w-${width}`}
              >
                {({ attributes, listeners }) => (
                  <>
                    <div
                      {...attributes}
                      {...listeners}
                      className="px-1 cursor-grab select-none opacity-0 flex items-center hover:opacity-100 transition-opacity"
                    >
                      ⠿
                    </div>
                    <ChordsReorder2
                      bar={bar}
                      onReorder={(barId, newChords) =>
                        onReorderChords(barId, newChords)
                      }
                    />
                  </>
                )}
              </SortableItemWrapper>
            )
          })}
        </SortableContext>
      </div>
    </DndContext>
  )
}
