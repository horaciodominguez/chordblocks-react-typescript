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
import type { Bar } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"
import SectionChords from "../ui/SectionBlocks"
import type { Block as BlockType } from "@/modules/songs/types/block.types"
import { Block } from "../Block"

type Props = {
  bar: Bar
  timeSignature: TimeSignature
  onReorder?: (barId: string, blocks: BlockType[]) => void
  onDeleteChord?: (chordId: string) => void
}

function SortableBlock({
  block,
  timeSignature,
  onDeleteChord,
}: {
  block: BlockType
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
  } = useSortable({ id: block.id })

  return (
    <Block
      ref={setNodeRef}
      timeSignature={timeSignature}
      block={block}
      dragStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        cursor: "cursor-grab",
      }}
      dragAttributes={attributes}
      dragListeners={listeners}
      isDragging={isDragging}
      onDelete={() => onDeleteChord?.(block.id)}
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
    const oldIndex = bar.blocks.findIndex((c) => c.id === active.id)
    const newIndex = bar.blocks.findIndex((c) => c.id === over.id)
    onReorder?.(bar.id, arrayMove(bar.blocks, oldIndex, newIndex))
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
        items={bar.blocks.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <SectionChords>
          {bar.blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              timeSignature={timeSignature}
              onDeleteChord={onDeleteChord}
            />
          ))}
        </SectionChords>
      </SortableContext>

      {createPortal(
        <DragOverlay>
          {activeChord ? (
            <Block
              timeSignature={timeSignature}
              block={bar.blocks.find((c) => c.id === activeChord)!}
              dragStyle={{
                width: chordWidth(
                  bar.blocks.find((c) => c.id === activeChord)!.duration,
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
