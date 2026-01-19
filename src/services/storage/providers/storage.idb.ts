import { openDB } from "idb"
import type { Song } from "@/modules/songs/types/song.types"

const DB_NAME = "ChordBlocks"
const STORE = "songs"
const PENDING = "pending"

async function getDb() {
  console.log("💾 idbStorage getDb called for:", DB_NAME)
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(PENDING)) {
        db.createObjectStore(PENDING, { keyPath: "id" })
      }
    },
  })
}

export const idbStorage = {
  async getSongs(): Promise<Song[]> {
    console.log("💾 idbStorage.getSongs called")
    const db = await getDb()
    return (await db.getAll(STORE)) as Song[]
  },

  async saveSong(song: Song) {
    console.log("💾 idbStorage.saveSong called for song:", song)
    const db = await getDb()
    await db.put(STORE, song)
  },

  async getSong(id: string): Promise<Song> {
    console.log("💾 idbStorage.getSong called for id:", id)
    const db = await getDb()
    return (await db.get(STORE, id)) as Song
  },

  async clearSongs() {
    console.log("💾 idbStorage.clearSongs called")
    const db = await getDb()
    await db.clear(STORE)
  },

  async addPending(song: Song) {
    console.log("💾 idbStorage.addPending called for song:", song)
    const db = await getDb()
    await db.put(PENDING, song)
  },

  async getPending(): Promise<Song[]> {
    console.log("💾 idbStorage.getPending called")
    const db = await getDb()
    return (await db.getAll(PENDING)) as Song[]
  },

  async clearPending() {
    console.log("💾 idbStorage.clearPending called")
    const db = await getDb()
    await db.clear(PENDING)
  },

  async deleteSong(id: string) {
    console.log("💾 idbStorage.deleteSong called for id:", id)
    const db = await getDb()
    await db.delete(STORE, id)
  },

  async addPendingDelete(id: string) {
    console.log("💾 idbStorage.addPendingDelete called for id:", id)
    const db = await getDb()
    const entry = { id, _action: "delete", deletedAt: new Date().toISOString() }
    await db.put(PENDING, entry)
  },

  async removePending(id: string) {
    console.log("💾 idbStorage.removePending called for id:", id)
    const db = await getDb()
    await db.delete(PENDING, id)
  },
}
