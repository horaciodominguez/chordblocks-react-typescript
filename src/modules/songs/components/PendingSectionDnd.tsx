import React from "react"
import { barWidthByTS } from "@/utils/widthByTS"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { TimeSignature } from "../types/song.types"
import { Chord } from "@/modules/chords/components/Chord"
import type { SongSection } from "../types/section.types"
import type { BarChord } from "../types/bar.types"

type Props = {
  section: SongSection
  timeSignature: TimeSignature
  onReorder: (payload: { barId: string; newOrderIds: string[] }) => void
  renderChord?: (chordId: string) => React.ReactNode
}

function SortableChord({
  chord,
  timeSignature,
  barId,
  renderChord,
}: {
  chord: BarChord
  timeSignature: TimeSignature
  barId: string
  renderChord?: (id: string) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chord.id,
      data: { barId },
    })

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  }

  return (
    <Chord
      ref={setNodeRef}
      chord={chord}
      timeSignature={timeSignature}
      renderChord={renderChord}
      // props dnd-kit
      dragStyle={dragStyle}
      dragAttributes={attributes as React.HTMLAttributes<HTMLDivElement>}
      dragListeners={listeners as React.HTMLAttributes<HTMLDivElement>}
    />
  )
}

export function PendingSectionDnd({
  section,
  timeSignature,
  onReorder,
  renderChord,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const fromBarId = (active.data.current?.barId as string) || ""
    const toBarId = (over.data.current?.barId as string) || ""
    if (!fromBarId || fromBarId !== toBarId) return

    const bar = section.bars.find((b) => b.id === fromBarId)
    if (!bar) return

    const oldIndex = bar.chords.findIndex((c) => c.id === active.id)
    const newIndex = bar.chords.findIndex((c) => c.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const newOrderIds = arrayMove(
      bar.chords.map((c) => c.id),
      oldIndex,
      newIndex
    )
    onReorder({ barId: fromBarId, newOrderIds })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-wrap divide-x-2 divide-blue-300 mb-4">
        {section.bars.map((bar) => {
          const width = barWidthByTS(timeSignature.beatsPerMeasure)
          const items = bar.chords.map((c) => c.id)

          return (
            <div
              key={bar.id}
              style={{ width }}
              className="flex divide-x-1 divide-blue-900 mb-4"
            >
              <SortableContext
                items={items}
                strategy={horizontalListSortingStrategy}
              >
                {bar.chords.map((chord) => (
                  <SortableChord
                    key={chord.id}
                    chord={chord}
                    timeSignature={timeSignature}
                    barId={bar.id}
                    renderChord={renderChord}
                  />
                ))}
              </SortableContext>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}
