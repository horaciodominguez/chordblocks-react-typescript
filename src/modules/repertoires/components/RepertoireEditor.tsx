import { useEffect, useMemo, useState } from "react"
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronUp, GripVertical, Minus, Plus, Trash } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import { StickyActionBar } from "@/components/layout/StickyActionBar"
import { useSongs } from "@/modules/songs/hooks/useSongs"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import { SongSearchPicker } from "@/modules/repertoires/components/SongSearchPicker"
import {
  addGroup,
  addItemToGroup,
  groupDroppableId,
  moveGroup,
  removeEmptyGroup,
  removeItem,
  reorderItem,
  setGroupTitle,
  setItemTranspose,
  setItemNotes,
  normalizeRepertoireNotes,
} from "@/modules/repertoires/utils/repertoire.edit"
import {
  formatSemitoneOffset,
  formatTransposePreview,
} from "@/modules/repertoires/utils/repertoire.transposePreview"
import type { Song } from "@/modules/songs/types/song.types"

const ITEM_TRANSPOSE_MIN = -6
const ITEM_TRANSPOSE_MAX = 6

type Props = {
  initial: Repertoire
  mutating?: boolean
  onSave: (rep: Repertoire) => Promise<void>
  onCancel: () => void
}

function SortableItemRow({
  id,
  title,
  artist,
  song,
  transposeSemitones,
  notes,
  onTranspose,
  onNotesChange,
  onRemove,
}: {
  id: string
  title: string
  artist?: string
  song?: Song
  transposeSemitones: number
  notes: string
  onTranspose: (next: number) => void
  onNotesChange: (notes: string) => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const preview = formatTransposePreview(song, transposeSemitones)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="shrink-0 touch-none cursor-grab text-zinc-500 hover:text-zinc-300 min-h-10 min-w-10 flex items-center justify-center"
          aria-label={`Drag ${title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-zinc-100 truncate">{title}</p>
          {artist ? (
            <p className="text-xs text-zinc-500 truncate">{artist}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="shrink-0 min-h-10 min-w-10 flex items-center justify-center text-red-400 hover:text-red-300"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
        >
          <Trash size={16} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pl-12">
        <span className="text-xs text-zinc-500">Transpose</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Transpose ${title} down`}
            disabled={transposeSemitones <= ITEM_TRANSPOSE_MIN}
            onClick={() =>
              onTranspose(
                Math.max(ITEM_TRANSPOSE_MIN, transposeSemitones - 1),
              )
            }
            className="flex items-center justify-center min-h-10 min-w-10 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Minus size={14} />
          </button>
          <span
            className="min-w-9 text-center text-sm font-semibold text-zinc-200 tabular-nums"
            aria-live="polite"
          >
            {formatSemitoneOffset(transposeSemitones)}
          </span>
          <button
            type="button"
            aria-label={`Transpose ${title} up`}
            disabled={transposeSemitones >= ITEM_TRANSPOSE_MAX}
            onClick={() =>
              onTranspose(
                Math.min(ITEM_TRANSPOSE_MAX, transposeSemitones + 1),
              )
            }
            className="flex items-center justify-center min-h-10 min-w-10 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus size={14} />
          </button>
        </div>
        {preview ? (
          <span className="text-xs font-medium text-amber-400/90 bg-amber-400/10 border border-amber-500/30 rounded px-2 py-1">
            {preview}
          </span>
        ) : null}
      </div>

      <div className="pl-12">
        <label className="sr-only" htmlFor={`notes-${id}`}>
          Night notes for {title}
        </label>
        <textarea
          id={`notes-${id}`}
          rows={2}
          className="w-full min-h-16 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Night notes (e.g. tono B, mya y iara)…"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </li>
  )
}

function GroupDropZone({
  groupId,
  children,
}: {
  groupId: string
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: groupDroppableId(groupId),
  })

  return (
    <ul
      ref={setNodeRef}
      className={`flex flex-col gap-2 min-h-12 rounded-md p-1 transition-colors ${
        isOver ? "bg-indigo-950/40 ring-1 ring-indigo-500/40" : ""
      }`}
    >
      {children}
    </ul>
  )
}

export function RepertoireEditor({
  initial,
  mutating = false,
  onSave,
  onCancel,
}: Props) {
  const { songs } = useSongs()
  const [draft, setDraft] = useState<Repertoire>(() => structuredClone(initial))
  const [targetGroupId, setTargetGroupId] = useState(
    () => initial.groups[0]?.id ?? "",
  )

  useEffect(() => {
    setDraft(structuredClone(initial))
    setTargetGroupId(initial.groups[0]?.id ?? "")
  }, [initial.id])

  useEffect(() => {
    if (!draft.groups.some((g) => g.id === targetGroupId)) {
      setTargetGroupId(draft.groups[0]?.id ?? "")
    }
  }, [draft.groups, targetGroupId])

  const songById = useMemo(() => {
    return new Map(songs.map((s) => [s.id, s]))
  }, [songs])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const nextGroups = reorderItem(
      draft.groups,
      String(active.id),
      String(over.id),
    )
    if (!nextGroups) return
    setDraft((prev) => ({ ...prev, groups: nextGroups }))
  }

  const handleAddSong = (songId: string) => {
    if (!targetGroupId) return
    setDraft((prev) => addItemToGroup(prev, targetGroupId, songId))
    const song = songById.get(songId)
    toast.success(song ? `Added “${song.title}”` : "Song added")
  }

  const handleSave = async () => {
    const title = draft.title.trim()
    if (!title) {
      toast.error("Title is required")
      return
    }
    await onSave(normalizeRepertoireNotes({ ...draft, title }))
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="panel-variant-1 flex flex-col gap-2">
        <label className="text-xs text-zinc-500" htmlFor="set-title">
          Set title
        </label>
        <input
          id="set-title"
          className="min-h-11 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-zinc-100"
          value={draft.title}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      <SongSearchPicker
        groups={draft.groups}
        targetGroupId={targetGroupId}
        onTargetGroupChange={setTargetGroupId}
        onAddSong={handleAddSong}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-zinc-300">Groups</h2>
        <Button
          type="button"
          variant="secondary"
          className="min-h-10 inline-flex items-center gap-1.5 px-3"
          onClick={() => {
            setDraft((prev) => {
              const next = addGroup(prev, "")
              const added = next.groups[next.groups.length - 1]
              setTargetGroupId(added.id)
              return next
            })
          }}
        >
          <Plus size={16} />
          Add group
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
          {draft.groups.map((group, groupIndex) => (
            <section
              key={group.id}
              className="panel-variant-1 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  className="flex-1 min-h-11 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-zinc-100"
                  value={group.title}
                  placeholder={`Group ${groupIndex + 1} title`}
                  aria-label={`Group ${groupIndex + 1} title`}
                  onChange={(e) =>
                    setDraft((prev) =>
                      setGroupTitle(prev, group.id, e.target.value),
                    )
                  }
                />
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="min-h-11 min-w-11 flex items-center justify-center border border-zinc-700 rounded-md text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
                    aria-label="Move group up"
                    disabled={groupIndex === 0}
                    onClick={() =>
                      setDraft((prev) => moveGroup(prev, group.id, -1))
                    }
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    className="min-h-11 min-w-11 flex items-center justify-center border border-zinc-700 rounded-md text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
                    aria-label="Move group down"
                    disabled={groupIndex === draft.groups.length - 1}
                    onClick={() =>
                      setDraft((prev) => moveGroup(prev, group.id, 1))
                    }
                  >
                    <ChevronDown size={18} />
                  </button>
                  <button
                    type="button"
                    className="min-h-11 min-w-11 flex items-center justify-center border border-zinc-700 rounded-md text-red-400 hover:text-red-300 disabled:opacity-40"
                    aria-label="Remove empty group"
                    disabled={
                      group.items.length > 0 || draft.groups.length <= 1
                    }
                    onClick={() => {
                      setDraft((prev) => {
                        const next = removeEmptyGroup(prev, group.id)
                        if (!next) {
                          toast.error(
                            group.items.length > 0
                              ? "Remove songs before deleting the group"
                              : "Keep at least one group",
                          )
                          return prev
                        }
                        return next
                      })
                    }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>

              <SortableContext
                items={group.items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <GroupDropZone groupId={group.id}>
                  {group.items.length === 0 ? (
                    <li className="list-none text-sm text-zinc-500 px-2 py-3 text-center">
                      Drop songs here or add from search
                    </li>
                  ) : (
                    group.items.map((item) => {
                      const song = songById.get(item.songId)
                      return (
                        <SortableItemRow
                          key={item.id}
                          id={item.id}
                          title={
                            song?.title ??
                            `Missing song (${item.songId.slice(0, 8)}…)`
                          }
                          artist={song?.artist}
                          song={song}
                          transposeSemitones={item.transposeSemitones}
                          notes={item.notes ?? ""}
                          onTranspose={(next) =>
                            setDraft((prev) =>
                              setItemTranspose(prev, item.id, next),
                            )
                          }
                          onNotesChange={(next) =>
                            setDraft((prev) =>
                              setItemNotes(prev, item.id, next),
                            )
                          }
                          onRemove={() =>
                            setDraft((prev) => removeItem(prev, item.id))
                          }
                        />
                      )
                    })
                  )}
                </GroupDropZone>
              </SortableContext>
            </section>
          ))}
        </div>
      </DndContext>

      <StickyActionBar>
        <Button
          type="button"
          variant="cancel"
          className="min-h-11"
          onClick={onCancel}
          disabled={mutating}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="save"
          className="min-h-11"
          onClick={handleSave}
          disabled={mutating}
        >
          Save set
        </Button>
      </StickyActionBar>
    </div>
  )
}
