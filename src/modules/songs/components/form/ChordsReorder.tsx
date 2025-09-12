import { Chord } from "@/modules/chords/components/Chord"
import { chordWidth } from "@/modules/chords/utils/chord.utils"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { createPortal } from "react-dom"
import type { Bar, BarChord } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"
import SectionChords from "../ui/SectionChords"

type Props = {
  bar: Bar
  timeSignature: TimeSignature
  onReorder?: (barId: string, chords: BarChord[]) => void
  onDeleteChord?: (chordId: string) => void
}

function SortableChord({
  chord,
  timeSignature,
  onDeleteChord,
}: {
  chord: BarChord
  timeSignature: TimeSignature
  onDeleteChord?: (chordId: string) => void
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
      dragStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        cursor: "cursor-grab",
      }}
      dragAttributes={attributes}
      dragListeners={listeners}
      isDragging={isDragging}
      onDelete={() => onDeleteChord?.(chord.id)}
    />
  )
}

export default function ChordsReorder({
  bar,
  timeSignature,
  onReorder,
  onDeleteChord,
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
        <SectionChords>
          {bar.chords.map((chord) => (
            <SortableChord
              key={chord.id}
              chord={chord}
              timeSignature={timeSignature}
              onDeleteChord={onDeleteChord}
            />
          ))}
        </SectionChords>
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
