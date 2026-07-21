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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowUpDown } from "lucide-react"
import type { SongSection } from "../../types/section.types"

const sectionHighlightClass =
  "rounded-md motion-safe:animate-section-highlight motion-safe:light:animate-section-highlight-light motion-reduce:bg-indigo-500/15 motion-reduce:shadow-[0_0_0_2px_rgb(129_140_248/0.5)] motion-reduce:light:bg-indigo-500/10 motion-reduce:light:shadow-[0_0_0_2px_rgb(99_102_241/0.25)]"

type Props = {
  sections: SongSection[]
  disabled?: boolean
  highlightedSectionId?: string
  onReorder: (order: string[]) => void
  onHighlightEnd?: () => void
  children: (section: SongSection, index: number) => React.ReactNode
}

function SortableSection({
  section,
  index,
  disabled,
  highlighted,
  onHighlightEnd,
  children,
}: {
  section: SongSection
  index: number
  disabled?: boolean
  highlighted: boolean
  onHighlightEnd?: () => void
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      id={`song-section-${section.id}`}
      style={style}
      className={`mb-8 min-w-0${highlighted ? ` ${sectionHighlightClass}` : ""}`}
      onAnimationEnd={
        highlighted
          ? (event) => {
              if (event.target === event.currentTarget) onHighlightEnd?.()
            }
          : undefined
      }
    >
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 cursor-grab touch-none text-xs
                    opacity-100 md:opacity-0 md:hover:opacity-100 transition
                    text-zinc-400 hover:text-zinc-200 mb-2 min-h-8 px-1 light:text-zinc-600 light:hover:text-zinc-900"
          aria-label={`Drag section ${index + 1}`}
        >
          <ArrowUpDown className="w-4 h-4" /> Section {index + 1}
        </div>
      )}
      {children}
    </div>
  )
}

export default function SectionsReorder({
  sections,
  disabled,
  highlightedSectionId,
  onReorder,
  onHighlightEnd,
  children,
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
    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    onReorder(arrayMove(sections, oldIndex, newIndex).map((s) => s.id))
  }

  if (disabled || sections.length < 2) {
    return (
      <>
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={`song-section-${section.id}`}
            className={`mb-8${section.id === highlightedSectionId ? ` ${sectionHighlightClass}` : ""}`}
            onAnimationEnd={
              section.id === highlightedSectionId
                ? (event) => {
                    if (event.target === event.currentTarget) onHighlightEnd?.()
                  }
                : undefined
            }
          >
            {children(section, index)}
          </div>
        ))}
      </>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section, index) => (
          <SortableSection
            key={section.id}
            section={section}
            index={index}
            highlighted={section.id === highlightedSectionId}
            onHighlightEnd={onHighlightEnd}
          >
            {children(section, index)}
          </SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  )
}
