import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"
import { Chord } from "@/modules/chords/components/Chord"
import type { Bar, BarChord } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"
import { useState } from "react"
import { chordWidth } from "@/utils/widthByTS"

type Props = {
  bar: Bar
  timeSignature: TimeSignature
  onReorder?: (barId: string, chords: BarChord[]) => void
  chordActions?: (chordId: string) => React.ReactNode
}

function SortableChord({
  chord,
  timeSignature,
  chordActions,
}: {
  chord: BarChord
  timeSignature: TimeSignature
  chordActions?: (chordId: string) => React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chord.id })

  return (
    <Chord
      ref={setNodeRef}
      timeSignature={timeSignature}
      chord={chord}
      chordActions={chordActions}
      dragStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        cursor: "cursor-grab",
      }}
      dragAttributes={attributes}
      dragListeners={listeners}
      isDragging={isDragging}
    />
  )
}

export default function ChordsReorder({
  bar,
  timeSignature,
  onReorder,
  chordActions,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = bar.chords.findIndex((c) => c.id === active.id)
    const newIndex = bar.chords.findIndex((c) => c.id === over.id)
    onReorder?.(bar.id, arrayMove(bar.chords, oldIndex, newIndex))
  }

  const [activeChord, setActiveChord] = useState<UniqueIdentifier | null>(null)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveChord(active.id)}
      onDragCancel={() => setActiveChord(null)}
    >
      <SortableContext
        items={bar.chords.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-2">
          {bar.chords.map((chord) => (
            <SortableChord
              key={chord.id}
              chord={chord}
              timeSignature={timeSignature}
              chordActions={chordActions}
            />
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay>
          {activeChord ? (
            <Chord
              timeSignature={timeSignature}
              chord={bar.chords.find((c) => c.id === activeChord)!}
              dragStyle={{
                width: chordWidth(
                  bar.chords.find((c) => c.id === activeChord)!.duration,
                  timeSignature.beatsPerMeasure
                ),
                display: "flex",
                opacity: 0.9,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}
