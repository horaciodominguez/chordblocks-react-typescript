import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import BlocksReorder from "@/modules/songs/components/form/BlocksReorder"
import type { Bar } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"

import { ArrowLeftRight } from "lucide-react"
import SectionBar from "../ui/SectionBars"
import type { SongSection } from "../../types/section.types"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
  onReorder: (bars: Bar[]) => void
  onReorderBlocks: (barId: string, blocks: Bar["blocks"]) => void
  onDeleteChord: (chordId: string) => void
}

function SortableBar({
  bar,
  index,
  timeSignature,
  onReorderBlocks,
  onDeleteChord,
}: {
  bar: Bar
  index: number
  timeSignature: TimeSignature
  onReorderBlocks: (barId: string, chords: Bar["blocks"]) => void
  onDeleteChord: (chordId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bar.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="BAR-EDITION-WRAP mb-2 py-2 pb-4 pt-0 "
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 
                  cursor-grab text-xs 
                  opacity-0 hover:opacity-100 transition text-zinc-400 hover:text-zinc-200 
                  mb-0"
      >
        <ArrowLeftRight className="w-4 h-4" /> Bar {index + 1}
      </div>
      <BlocksReorder
        bar={bar}
        timeSignature={timeSignature}
        onReorder={onReorderBlocks}
        onDeleteChord={onDeleteChord}
      />
    </div>
  )
}

export default function BarsReorder({
  section,
  timeSignature,
  onReorder,
  onReorderBlocks,
  onDeleteChord,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = section.bars.findIndex((b) => b.id === active.id)
    const newIndex = section.bars.findIndex((b) => b.id === over.id)
    onReorder(arrayMove(section.bars, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SectionBar id={section.id} section={section}>
        <SortableContext
          items={section.bars.map((b) => b.id)}
          strategy={horizontalListSortingStrategy}
        >
          {section.bars.map((bar, i) => (
            <SortableBar
              key={bar.id}
              bar={bar}
              index={i}
              timeSignature={timeSignature}
              onReorderBlocks={onReorderBlocks}
              onDeleteChord={onDeleteChord}
            />
          ))}
        </SortableContext>
      </SectionBar>
    </DndContext>
  )
}
