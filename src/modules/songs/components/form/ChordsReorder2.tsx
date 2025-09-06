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

import type { Bar, BarChord } from "../../types/bar.types"

type Props = {
  bar: Bar
  onReorder?: (barId: string, chords: BarChord[]) => void
}

export default function ChordsReorder({ bar, onReorder }: Props) {
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = useReorder(bar.chords, (newChords) =>
    onReorder?.(bar.id, newChords)
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={bar.chords.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-2 divide-x-1 divide-blue-900">
          {bar.chords.map((chord) => (
            <SortableItemWrapper
              key={chord.id}
              id={chord.id}
              className="flex justify-center  "
            >
              {({ attributes, listeners }) => (
                <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
                  {chord.name}
                </div>
              )}
            </SortableItemWrapper>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
