import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

/** Replace songId references in a repertoire. */
export function remapSongIdInRepertoire(
  rep: Repertoire,
  fromId: string,
  toId: string,
): Repertoire {
  if (fromId === toId) return rep
  let changed = false
  const groups = rep.groups.map((g) => {
    const items = g.items.map((item) => {
      if (item.songId !== fromId) return item
      changed = true
      return { ...item, songId: toId }
    })
    return items === g.items ? g : { ...g, items }
  })
  if (!changed) return rep
  return {
    ...rep,
    groups,
    updatedAt: new Date().toISOString(),
  }
}

/** Drop set items that reference any of the given song ids. */
export function removeSongIdsFromRepertoire(
  rep: Repertoire,
  songIds: ReadonlySet<string>,
): Repertoire {
  if (songIds.size === 0) return rep
  let changed = false
  const groups = rep.groups.map((g) => {
    const items = g.items.filter((item) => {
      if (!songIds.has(item.songId)) return true
      changed = true
      return false
    })
    return items.length === g.items.length ? g : { ...g, items }
  })
  if (!changed) return rep
  return {
    ...rep,
    groups,
    updatedAt: new Date().toISOString(),
  }
}
