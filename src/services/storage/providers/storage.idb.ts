import { openDB } from "idb"
import type { Song } from "@/modules/songs/types/song.types"

const DB_NAME = "ChordBlocks"
const STORE = "songs"
const PENDING = "pending"

async function getDb() {
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
    console.log("getSongs idb")
    const db = await getDb()
    return (await db.getAll(STORE)) as Song[]
  },

  async saveSong(song: Song) {
    console.log("saveSong idb: Song:", song)
    const db = await getDb()
    await db.put(STORE, song)
  },

  async getSong(id: string): Promise<Song> {
    console.log("getSong idb: SongId:", id)
    const db = await getDb()
    return (await db.get(STORE, id)) as Song
  },

  async clearSongs() {
    console.log("clearSongs idb")
    const db = await getDb()
    await db.clear(STORE)
  },

  async addPending(song: Song) {
    console.log("addPending idb: Song:", song)
    const db = await getDb()
    await db.put(PENDING, song)
  },

  async getPending(): Promise<Song[]> {
    console.log("getPending idb")
    const db = await getDb()
    return (await db.getAll(PENDING)) as Song[]
  },

  async clearPending() {
    console.log("clearPending idb")
    const db = await getDb()
    await db.clear(PENDING)
  },
}
