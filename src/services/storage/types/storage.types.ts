import type { Song } from "@/modules/songs/types/song.types"

export interface StorageProvider {
  getSongs(): Promise<Song[]>
  getSong(id: string): Promise<Song | null>
  saveSong(song: Song): Promise<void>
  deleteSong(id: string): Promise<void>
  updateSong(song: Song): Promise<void>
}
