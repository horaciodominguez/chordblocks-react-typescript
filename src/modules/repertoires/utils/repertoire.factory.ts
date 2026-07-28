import { v4 as uuidv4 } from "uuid"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

export function touchRepertoire(rep: Repertoire): Repertoire {
  return {
    ...rep,
    updatedAt: new Date().toISOString(),
    createdAt: rep.createdAt || new Date().toISOString(),
  }
}

export function createEmptyRepertoire(title = "New set"): Repertoire {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title,
    groups: [
      {
        id: uuidv4(),
        title: "",
        items: [],
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Creates an independent copy of a set.
 *
 * IDs are regenerated at every level because sets, groups, and items are
 * persisted entities and must not share primary keys with the original.
 */
export function duplicateRepertoire(
  repertoire: Repertoire,
  title = `${repertoire.title} copy`,
): Repertoire {
  const now = new Date().toISOString()

  return {
    id: uuidv4(),
    title,
    groups: repertoire.groups.map((group) => ({
      id: uuidv4(),
      title: group.title,
      items: group.items.map((item) => ({
        id: uuidv4(),
        songId: item.songId,
        transposeSemitones: item.transposeSemitones,
        ...(item.notes !== undefined ? { notes: item.notes } : {}),
      })),
    })),
    createdAt: now,
    updatedAt: now,
  }
}
