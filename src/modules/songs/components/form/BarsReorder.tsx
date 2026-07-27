import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
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
import type { ReactNode } from "react"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
  onReorder: (bars: Bar[]) => void
  onReorderBlocks: (barId: string, blocks: Bar["blocks"]) => void
  onDeleteChord: (chordId: string) => void
  onUpdateDuration?: (blockId: string, duration: number) => void
  onUpdateVoicing?: (blockId: string, voicing: number) => void
  onUpdateRefTime?: (blockId: string, refTime: number | undefined) => void
  onUpdateLyric?: (blockId: string, lyric: string | undefined) => void
  hasYoutubeUrl?: boolean
  flashBlockId?: string | null
  /** Inside the last bar’s flex row when that measure still has free beats. */
  lastBarEndSlot?: ReactNode
  /**
   * Next grid cell after the last bar when that measure is full.
   * Stays on the same row if the section grid has a free column; wraps below only then.
   */
  afterBarsSlot?: ReactNode
}

function SortableBar({
  bar,
  index,
  isPickup,
  pickupBeats,
  timeSignature,
  onReorderBlocks,
  onDeleteChord,
  onUpdateDuration,
  onUpdateVoicing,
  onUpdateRefTime,
  onUpdateLyric,
  hasYoutubeUrl,
  flashBlockId,
  endSlot,
  showMeasureSeparator,
}: {
  bar: Bar
  index: number
  isPickup: boolean
  pickupBeats?: number
  timeSignature: TimeSignature
  onReorderBlocks: (barId: string, chords: Bar["blocks"]) => void
  onDeleteChord: (chordId: string) => void
  onUpdateDuration?: (blockId: string, duration: number) => void
  onUpdateVoicing?: (blockId: string, voicing: number) => void
  onUpdateRefTime?: (blockId: string, refTime: number | undefined) => void
  onUpdateLyric?: (blockId: string, lyric: string | undefined) => void
  hasYoutubeUrl?: boolean
  flashBlockId?: string | null
  endSlot?: ReactNode
  showMeasureSeparator: boolean
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
      className="BAR-EDITION-WRAP mb-2 flex h-full min-h-0 min-w-0 flex-col py-2 pb-2 pt-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 cursor-grab touch-none text-xs
                  opacity-100 md:opacity-0 md:hover:opacity-100 transition
                  text-zinc-400 hover:text-zinc-200 mb-1 min-h-8 px-1 light:text-zinc-600 light:hover:text-zinc-900"
        aria-label={isPickup ? "Drag pickup bar" : `Drag bar ${index + 1}`}
      >
        <ArrowLeftRight className="w-4 h-4" />{" "}
        {isPickup ? `Pickup (${pickupBeats})` : `Bar ${index + 1}`}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <BlocksReorder
          bar={bar}
          barIndex={index}
          pickupBeats={pickupBeats}
          isPickup={isPickup}
          timeSignature={timeSignature}
          onReorder={onReorderBlocks}
          onDeleteChord={onDeleteChord}
          onUpdateDuration={onUpdateDuration}
          onUpdateVoicing={onUpdateVoicing}
          onUpdateRefTime={onUpdateRefTime}
          onUpdateLyric={onUpdateLyric}
          hasYoutubeUrl={hasYoutubeUrl}
          showMeasureSeparator={showMeasureSeparator}
          flashBlockId={flashBlockId}
          endSlot={endSlot}
        />
      </div>
    </div>
  )
}

export default function BarsReorder({
  section,
  timeSignature,
  onReorder,
  onReorderBlocks,
  onDeleteChord,
  onUpdateDuration,
  onUpdateVoicing,
  onUpdateRefTime,
  onUpdateLyric,
  hasYoutubeUrl,
  flashBlockId,
  lastBarEndSlot,
  afterBarsSlot,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = section.bars.findIndex((b) => b.id === active.id)
    const newIndex = section.bars.findIndex((b) => b.id === over.id)
    onReorder(arrayMove(section.bars, oldIndex, newIndex))
  }

  const showAfterSlot = Boolean(afterBarsSlot)

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
          {section.bars.map((bar, i) => {
            const isLastBar = i === section.bars.length - 1
            return (
              <SortableBar
                key={bar.id}
                bar={bar}
                index={i}
                isPickup={i === 0 && Boolean(section.pickupBeats)}
                pickupBeats={section.pickupBeats}
                timeSignature={timeSignature}
                onReorderBlocks={onReorderBlocks}
                onDeleteChord={onDeleteChord}
                onUpdateDuration={onUpdateDuration}
                onUpdateVoicing={onUpdateVoicing}
                onUpdateRefTime={onUpdateRefTime}
                onUpdateLyric={onUpdateLyric}
                hasYoutubeUrl={hasYoutubeUrl}
                flashBlockId={flashBlockId}
                endSlot={isLastBar ? lastBarEndSlot : undefined}
                showMeasureSeparator={
                  !isLastBar || (isLastBar && showAfterSlot)
                }
              />
            )
          })}
        </SortableContext>

        {showAfterSlot ? (
          <div className="BAR-EDITION-WRAP mb-2 flex h-full min-h-0 min-w-0 flex-col py-2 pb-2 pt-0">
            <div
              className="mb-1 min-h-8 px-1 text-xs text-zinc-500 light:text-zinc-600"
              aria-hidden
            >
              &nbsp;
            </div>
            <div className="relative flex min-h-0 w-full flex-1 items-stretch py-2">
              {afterBarsSlot}
            </div>
          </div>
        ) : null}
      </SectionBar>
    </DndContext>
  )
}
