import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

/** Local pending queue for repertoire mutations (separate from song pending). */
export interface PendingRepertoireDelete {
  id: string
  _action: "delete"
  deletedAt: string
}

export type PendingRepertoireDrafts = Repertoire | PendingRepertoireDelete

export function isPendingRepertoireDelete(
  p: PendingRepertoireDrafts,
): p is PendingRepertoireDelete {
  return "_action" in p && (p as PendingRepertoireDelete)._action === "delete"
}
