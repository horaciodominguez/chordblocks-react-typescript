import type {
  Repertoire,
  RepertoireItem,
} from "@/modules/repertoires/types/repertoire.types"

export type FlatRepertoireEntry = {
  item: RepertoireItem
  groupId: string
  /** 0-based index in flat set order */
  index: number
}

export function flattenRepertoireItems(
  repertoire: Repertoire,
): FlatRepertoireEntry[] {
  const flat: FlatRepertoireEntry[] = []
  for (const group of repertoire.groups) {
    for (const item of group.items) {
      flat.push({
        item,
        groupId: group.id,
        index: flat.length,
      })
    }
  }
  return flat
}

export type SetSongContext = {
  repertoireId: string
  itemId: string
  mode?: "play"
}

export function setSongPath(
  songId: string,
  repertoireId: string,
  itemId: string,
  options?: { mode?: "play" },
): string {
  const params = new URLSearchParams({
    repertoireId,
    itemId,
  })
  if (options?.mode === "play") {
    params.set("mode", "play")
  }
  return `/song/${songId}?${params.toString()}`
}

/** Song detail URL, optionally preserving set context from query params. */
export function songViewPath(
  songId: string,
  context?: Partial<SetSongContext> | null,
): string {
  const repertoireId = context?.repertoireId
  const itemId = context?.itemId
  if (!repertoireId || !itemId) return `/song/${songId}`
  return setSongPath(songId, repertoireId, itemId, {
    mode: context?.mode,
  })
}

/** Edit song URL, optionally preserving set context. */
export function songEditPath(
  songId: string,
  context?: Partial<SetSongContext> | null,
): string {
  const repertoireId = context?.repertoireId
  const itemId = context?.itemId
  if (!repertoireId || !itemId) return `/song/${songId}/edit`

  const params = new URLSearchParams({ repertoireId, itemId })
  if (context?.mode === "play") {
    params.set("mode", "play")
  }
  return `/song/${songId}/edit?${params.toString()}`
}

export function isPlayModeParam(mode: string | null): boolean {
  return mode === "play"
}

export type SetNavContext = {
  repertoireId: string
  repertoireTitle: string
  current: FlatRepertoireEntry
  prev: FlatRepertoireEntry | null
  next: FlatRepertoireEntry | null
  total: number
}

/**
 * Resolve prev/next within a repertoire for the given itemId.
 * Returns null if the item is not in the set.
 */
export function getSetNavContext(
  repertoire: Repertoire,
  itemId: string,
): SetNavContext | null {
  const flat = flattenRepertoireItems(repertoire)
  const index = flat.findIndex((e) => e.item.id === itemId)
  if (index < 0) return null

  return {
    repertoireId: repertoire.id,
    repertoireTitle: repertoire.title,
    current: flat[index],
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
    total: flat.length,
  }
}
