export type SyncEntity = {
  id: string
  updatedAt: string
}

export function isNewer(a: SyncEntity, b: SyncEntity): boolean {
  return new Date(a.updatedAt) > new Date(b.updatedAt)
}

export type MembershipPlan<T extends SyncEntity> = {
  toWriteIdb: T[]
  toUpsertRemote: T[]
  orphanLocalIds: string[]
}

/**
 * Pure membership + LWW planner (Supabase ID set is authoritative).
 * - both → LWW
 * - remote only → IDB
 * - local only + pendingSave → upsert
 * - local only + holdIds → keep in IDB (awaiting conflict resolution)
 * - local only without pending → orphan (purge)
 */
export function planMembershipSync<T extends SyncEntity>(
  local: T[],
  remote: T[],
  pendingSaveIds: Set<string>,
  holdIds: Set<string> = new Set(),
): MembershipPlan<T> {
  const remoteIds = new Set(remote.map((r) => r.id))
  const localById = new Map(local.map((l) => [l.id, l]))

  const toWriteIdb: T[] = []
  const toUpsertRemote: T[] = []
  const orphanLocalIds: string[] = []

  for (const r of remote) {
    const l = localById.get(r.id)
    if (l && isNewer(l, r)) {
      toWriteIdb.push(l)
      toUpsertRemote.push(l)
    } else {
      toWriteIdb.push(r)
    }
  }

  for (const l of local) {
    if (remoteIds.has(l.id)) continue
    if (holdIds.has(l.id)) {
      toWriteIdb.push(l)
      continue
    }
    if (pendingSaveIds.has(l.id)) {
      toWriteIdb.push(l)
      toUpsertRemote.push(l)
    } else {
      orphanLocalIds.push(l.id)
    }
  }

  return { toWriteIdb, toUpsertRemote, orphanLocalIds }
}
