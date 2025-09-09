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
import ChordsReorder from "@/modules/songs/components/form/ChordsReorder"
import type { Bar } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"
import { getGridColumns } from "@/utils/widthByTS"
import { ArrowLeftRight } from "lucide-react"

type Props = {
  sectionId: string
  bars: Bar[]
  timeSignature: TimeSignature
  onReorder: (bars: Bar[]) => void
  onReorderChords: (barId: string, chords: Bar["chords"]) => void
  onDeleteChord: (chordId: string) => void
}

function SortableBar({
  bar,
  index,
  timeSignature,
  onReorderChords,
  onDeleteChord,
}: {
  bar: Bar
  index: number
  timeSignature: TimeSignature
  onReorderChords: (barId: string, chords: Bar["chords"]) => void
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
    /* width: barWidthByTS(timeSignature.beatsPerMeasure), */
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
      <ChordsReorder
        bar={bar}
        timeSignature={timeSignature}
        onReorder={onReorderChords}
        onDeleteChord={onDeleteChord}
      />
    </div>
  )
}

export default function BarsReorder({
  sectionId,
  bars,
  timeSignature,
  onReorder,
  onReorderChords,
  onDeleteChord,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = bars.findIndex((b) => b.id === active.id)
    const newIndex = bars.findIndex((b) => b.id === over.id)
    onReorder(arrayMove(bars, oldIndex, newIndex))
  }

  const gridPerMueasureValue = getGridColumns(timeSignature.beatsPerMeasure)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        id={sectionId}
        className={`SECTION-WRAP grid grid-cols-${gridPerMueasureValue} divide-x-2 divide-blue-300 gap-2 mb-4`}
      >
        <SortableContext
          items={bars.map((b) => b.id)}
          strategy={horizontalListSortingStrategy}
        >
          {bars.map((bar, i) => (
            <SortableBar
              key={bar.id}
              bar={bar}
              index={i}
              timeSignature={timeSignature}
              onReorderChords={onReorderChords}
              onDeleteChord={onDeleteChord}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}
