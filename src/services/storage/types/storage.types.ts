import type { Song } from "@/modules/songs/types/song.types"

export interface StorageProvider {
  getSongs(): Promise<Song[]>
  saveSong(song: Song): Promise<void>
  getSong(userId: string, songId: string): Promise<Song>
  addPending(song: Song): Promise<void>
  getPending(): Promise<Song[]>
  clearPending(): Promise<void>
  deleteSong(songId: string): Promise<void>
}

export interface PendingDelete {
  id: string
  _action: "delete"
  deletedAt: string
}

export type PendingDrafts = Song | PendingDelete
