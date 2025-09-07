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
import { barWidthByTS } from "@/utils/widthByTS"

type Props = {
  sectionId: string
  bars: Bar[]
  timeSignature: TimeSignature
  onReorder: (bars: Bar[]) => void
  onReorderChords: (barId: string, chords: Bar["chords"]) => void
  chordActions: (chordId: string) => React.ReactNode
}

function SortableBar({
  bar,
  index,
  timeSignature,
  onReorderChords,
  chordActions,
}: {
  bar: Bar
  index: number
  timeSignature: TimeSignature
  onReorderChords: (barId: string, chords: Bar["chords"]) => void
  chordActions: (chordId: string) => React.ReactNode
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
    width: barWidthByTS(timeSignature.beatsPerMeasure),
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-2 p-2  backdrop-blur-md ">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-xs text-gray-200 mb-2"
      >
        ⠿ Bar {index + 1}
      </div>
      <ChordsReorder
        bar={bar}
        timeSignature={timeSignature}
        onReorder={onReorderChords}
        chordActions={chordActions}
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
  chordActions,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = bars.findIndex((b) => b.id === active.id)
    const newIndex = bars.findIndex((b) => b.id === over.id)
    onReorder(arrayMove(bars, oldIndex, newIndex))
  }

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
          {bars.map((bar, i) => (
            <SortableBar
              key={bar.id}
              bar={bar}
              index={i}
              timeSignature={timeSignature}
              onReorderChords={onReorderChords}
              chordActions={chordActions}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}
