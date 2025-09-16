import { openDB, type IDBPDatabase } from "idb"
import type { StorageProvider } from "../types/storage.types"
import type { Song } from "@/modules/songs/types/song.types"

let dbPromise: Promise<IDBPDatabase>

function initDb() {
  if (!dbPromise) {
    dbPromise = openDB("ChordBlocks-db", 1, {
      upgrade(db) {
        db.createObjectStore("songs", {
          keyPath: "id",
          autoIncrement: true,
        })
      },
    })
  }
  return dbPromise
}

export const storageProviderIdb: StorageProvider = {
  async getSongs() {
    const db = await initDb()
    return db.getAll("songs")
  },
  async getSong(id: string) {
    const db = await initDb()
    return db.get("songs", id)
  },
  async saveSong(song: Song) {
    const db = await initDb()
    await db.put("songs", song)
  },
  async deleteSong(id: string) {
    const db = await initDb()
    await db.delete("songs", id)
  },
  async updateSong(song: Song) {
    const db = await initDb()
    await db.put("songs", song)
  },
}
