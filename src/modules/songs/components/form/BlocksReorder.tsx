import { chordOverlayWidth } from "@/modules/chords/utils/chord.utils"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
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
import { Fragment, useState } from "react"
import { createPortal } from "react-dom"
import type { Bar } from "../../types/bar.types"
import type { TimeSignature } from "../../types/song.types"
import { allowedBlockDurations, barCapacity } from "../../utils/beats"
import { BarSeparator } from "../ui/BarSeparator"
import SectionChords from "../ui/SectionBlocks"
import type { Block as BlockType } from "@/modules/songs/types/block.types"
import { Block } from "../Block"

type Props = {
  bar: Bar
  barIndex: number
  pickupBeats?: number
  timeSignature: TimeSignature
  onReorder?: (barId: string, blocks: BlockType[]) => void
  onDeleteChord?: (chordId: string) => void
  onUpdateDuration?: (blockId: string, duration: number) => void
  onUpdateVoicing?: (blockId: string, voicing: number) => void
  onUpdateRefTime?: (blockId: string, refTime: number | undefined) => void
  onUpdateLyric?: (blockId: string, lyric: string | undefined) => void
  hasYoutubeUrl?: boolean
  showMeasureSeparator?: boolean
  isPickup?: boolean
}

function SortableBlock({
  bar,
  barCapacityBeats,
  block,
  timeSignature,
  onDeleteChord,
  onUpdateDuration,
  onUpdateVoicing,
  onUpdateRefTime,
  onUpdateLyric,
  hasYoutubeUrl,
}: {
  bar: Bar
  barCapacityBeats: number
  block: BlockType
  timeSignature: TimeSignature
  onDeleteChord?: (chordId: string) => void
  onUpdateDuration?: (blockId: string, duration: number) => void
  onUpdateVoicing?: (blockId: string, voicing: number) => void
  onUpdateRefTime?: (blockId: string, refTime: number | undefined) => void
  onUpdateLyric?: (blockId: string, lyric: string | undefined) => void
  hasYoutubeUrl?: boolean
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
        cursor: "grab",
      }}
      dragAttributes={attributes}
      dragListeners={listeners}
      isDragging={isDragging}
      onDelete={() => onDeleteChord?.(block.id)}
      onUpdateDuration={
        onUpdateDuration
          ? (duration) => onUpdateDuration(block.id, duration)
          : undefined
      }
      onUpdateVoicing={
        onUpdateVoicing
          ? (voicing) => onUpdateVoicing(block.id, voicing)
          : undefined
      }
      onUpdateRefTime={
        onUpdateRefTime
          ? (refTime) => onUpdateRefTime(block.id, refTime)
          : undefined
      }
      onUpdateLyric={
        onUpdateLyric
          ? (lyric) => onUpdateLyric(block.id, lyric)
          : undefined
      }
      hasYoutubeUrl={hasYoutubeUrl}
      showDiagram
      durationOptions={allowedBlockDurations(
        bar,
        block.id,
        barCapacityBeats,
      )}
    />
  )
}

export default function ChordsReorder({
  bar,
  barIndex = 0,
  pickupBeats,
  timeSignature,
  onReorder,
  onDeleteChord,
  onUpdateDuration,
  onUpdateVoicing,
  onUpdateRefTime,
  onUpdateLyric,
  hasYoutubeUrl,
  showMeasureSeparator = false,
  isPickup = false,
}: Props) {
  const capacity = barCapacity(
    timeSignature.beatsPerMeasure,
    barIndex,
    pickupBeats,
  )
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
        <SectionChords
          showMeasureSeparator={showMeasureSeparator}
          isPickup={isPickup}
        >
          {bar.blocks.map((block, blockIndex) => (
            <Fragment key={block.id}>
              {blockIndex > 0 && <BarSeparator />}
              <SortableBlock
                bar={bar}
                barCapacityBeats={capacity}
                block={block}
                timeSignature={timeSignature}
                onDeleteChord={onDeleteChord}
                onUpdateDuration={onUpdateDuration}
                onUpdateVoicing={onUpdateVoicing}
                onUpdateRefTime={onUpdateRefTime}
                onUpdateLyric={onUpdateLyric}
                hasYoutubeUrl={hasYoutubeUrl}
              />
            </Fragment>
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
                width: chordOverlayWidth(
                  bar.blocks.find((c) => c.id === activeChord)!.duration,
                ),
                flex: "none",
                display: "flex",
                opacity: 0.9,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
