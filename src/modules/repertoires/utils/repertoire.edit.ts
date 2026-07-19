import { arrayMove } from "@dnd-kit/sortable"
import { v4 as uuidv4 } from "uuid"
import type {
  Repertoire,
  RepertoireGroup,
  RepertoireItem,
} from "@/modules/repertoires/types/repertoire.types"

export const GROUP_DROP_PREFIX = "group-drop-"

export function groupDroppableId(groupId: string): string {
  return `${GROUP_DROP_PREFIX}${groupId}`
}

export function parseGroupDroppableId(id: string): string | null {
  return id.startsWith(GROUP_DROP_PREFIX)
    ? id.slice(GROUP_DROP_PREFIX.length)
    : null
}

export function createRepertoireItem(songId: string): RepertoireItem {
  return {
    id: uuidv4(),
    songId,
    transposeSemitones: 0,
  }
}

export function createRepertoireGroup(title = ""): RepertoireGroup {
  return {
    id: uuidv4(),
    title,
    items: [],
  }
}

export function findGroupIdByItemId(
  groups: RepertoireGroup[],
  itemId: string,
): string | undefined {
  return groups.find((g) => g.items.some((i) => i.id === itemId))?.id
}

/** Resolve which group an over/active id belongs to (item id or group droppable). */
export function findContainerId(
  groups: RepertoireGroup[],
  id: string,
): string | undefined {
  const fromDroppable = parseGroupDroppableId(id)
  if (fromDroppable && groups.some((g) => g.id === fromDroppable)) {
    return fromDroppable
  }
  return findGroupIdByItemId(groups, id)
}

export function addItemToGroup(
  rep: Repertoire,
  groupId: string,
  songId: string,
): Repertoire {
  const item = createRepertoireItem(songId)
  return {
    ...rep,
    groups: rep.groups.map((g) =>
      g.id === groupId ? { ...g, items: [...g.items, item] } : g,
    ),
  }
}

export function removeItem(rep: Repertoire, itemId: string): Repertoire {
  return {
    ...rep,
    groups: rep.groups.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.id !== itemId),
    })),
  }
}

const TRANSPOSE_CLAMP_MIN = -12
const TRANSPOSE_CLAMP_MAX = 12

export function clampItemTranspose(semitones: number): number {
  return Math.max(
    TRANSPOSE_CLAMP_MIN,
    Math.min(TRANSPOSE_CLAMP_MAX, Math.round(semitones)),
  )
}

export function setItemTranspose(
  rep: Repertoire,
  itemId: string,
  semitones: number,
): Repertoire {
  const next = clampItemTranspose(semitones)
  return {
    ...rep,
    groups: rep.groups.map((g) => ({
      ...g,
      items: g.items.map((i) =>
        i.id === itemId ? { ...i, transposeSemitones: next } : i,
      ),
    })),
  }
}

export function setItemNotes(
  rep: Repertoire,
  itemId: string,
  notes: string,
): Repertoire {
  return {
    ...rep,
    groups: rep.groups.map((g) => ({
      ...g,
      items: g.items.map((i) => {
        if (i.id !== itemId) return i
        if (!notes) {
          return {
            id: i.id,
            songId: i.songId,
            transposeSemitones: i.transposeSemitones,
          }
        }
        return { ...i, notes }
      }),
    })),
  }
}

/** Trim item notes before persist; drop empty notes. */
export function normalizeRepertoireNotes(rep: Repertoire): Repertoire {
  return {
    ...rep,
    groups: rep.groups.map((g) => ({
      ...g,
      items: g.items.map((i) => {
        const trimmed = i.notes?.trim()
        if (!trimmed) {
          return {
            id: i.id,
            songId: i.songId,
            transposeSemitones: i.transposeSemitones,
          }
        }
        return { ...i, notes: trimmed }
      }),
    })),
  }
}

export function setGroupTitle(
  rep: Repertoire,
  groupId: string,
  title: string,
): Repertoire {
  return {
    ...rep,
    groups: rep.groups.map((g) =>
      g.id === groupId ? { ...g, title } : g,
    ),
  }
}

export function addGroup(rep: Repertoire, title = ""): Repertoire {
  return {
    ...rep,
    groups: [...rep.groups, createRepertoireGroup(title)],
  }
}

/** Removes an empty group. Keeps at least one group. */
export function removeEmptyGroup(
  rep: Repertoire,
  groupId: string,
): Repertoire | null {
  const group = rep.groups.find((g) => g.id === groupId)
  if (!group || group.items.length > 0) return null
  if (rep.groups.length <= 1) return null
  return {
    ...rep,
    groups: rep.groups.filter((g) => g.id !== groupId),
  }
}

export function moveGroup(
  rep: Repertoire,
  groupId: string,
  direction: -1 | 1,
): Repertoire {
  const index = rep.groups.findIndex((g) => g.id === groupId)
  if (index < 0) return rep
  const next = index + direction
  if (next < 0 || next >= rep.groups.length) return rep
  return {
    ...rep,
    groups: arrayMove(rep.groups, index, next),
  }
}

/**
 * Reorder an item within its group or move it to another group.
 * Returns null if the drag cannot be applied.
 */
export function reorderItem(
  groups: RepertoireGroup[],
  activeId: string,
  overId: string,
): RepertoireGroup[] | null {
  const activeContainer = findContainerId(groups, activeId)
  const overContainer = findContainerId(groups, overId)
  if (!activeContainer || !overContainer) return null

  const next = groups.map((g) => ({ ...g, items: [...g.items] }))
  const source = next.find((g) => g.id === activeContainer)
  const dest = next.find((g) => g.id === overContainer)
  if (!source || !dest) return null

  const oldIndex = source.items.findIndex((i) => i.id === activeId)
  if (oldIndex < 0) return null

  if (activeContainer === overContainer) {
    const dropGroupId = parseGroupDroppableId(overId)
    const newIndex = dropGroupId
      ? source.items.length - 1
      : source.items.findIndex((i) => i.id === overId)
    if (newIndex < 0 || oldIndex === newIndex) return null
    source.items = arrayMove(source.items, oldIndex, newIndex)
    return next
  }

  const [moved] = source.items.splice(oldIndex, 1)
  const dropGroupId = parseGroupDroppableId(overId)
  let insertIndex: number
  if (dropGroupId) {
    insertIndex = dest.items.length
  } else {
    insertIndex = dest.items.findIndex((i) => i.id === overId)
    if (insertIndex < 0) insertIndex = dest.items.length
  }
  dest.items.splice(insertIndex, 0, moved)
  return next
}
