import type { Song } from "@/modules/songs/types/song.types"

export interface PendingDelete {
  id: string
  _action: "delete"
  deletedAt: string
}

export type PendingDrafts = Song | PendingDelete

export function isPendingDelete(p: PendingDrafts): p is PendingDelete {
  return "_action" in p && (p as PendingDelete)._action === "delete"
}

/** Local IDB-oriented contract (actual implementation). */
export interface LocalStorageApi {
  getSongs(): Promise<Song[]>
  saveSong(song: Song): Promise<void>
  getSong(id: string): Promise<Song | undefined>
  deleteSong(songId: string): Promise<void>
  clearSongs(): Promise<void>
  addPending(song: Song): Promise<void>
  getPending(): Promise<PendingDrafts[]>
  clearPending(): Promise<void>
  addPendingDelete(id: string): Promise<void>
  removePending(id: string): Promise<void>
  prepareForUser(userId: string | null): Promise<boolean>
  clearAllLocalData(): Promise<void>
  getLastUserId(): string | null
  setLastUserId(userId: string | null): void
}

/** @deprecated Prefer LocalStorageApi */
export type StorageProvider = LocalStorageApi
