import { openDB } from "idb"
import type { Song } from "@/modules/songs/types/song.types"
import type { PendingDrafts } from "@/services/storage/types/storage.types"

const DB_NAME = "ChordBlocks"
const STORE = "songs"
const PENDING = "pending"
const LAST_USER_KEY = "chordblocks:lastUserId"

function log(...args: unknown[]) {
  if (import.meta.env.DEV) console.log(...args)
}

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
    log("💾 idbStorage.getSongs")
    const db = await getDb()
    return (await db.getAll(STORE)) as Song[]
  },

  async saveSong(song: Song) {
    log("💾 idbStorage.saveSong", song.id)
    const db = await getDb()
    await db.put(STORE, song)
  },

  async getSong(id: string): Promise<Song | undefined> {
    const db = await getDb()
    return (await db.get(STORE, id)) as Song | undefined
  },

  async clearSongs() {
    log("💾 idbStorage.clearSongs")
    const db = await getDb()
    await db.clear(STORE)
  },

  async addPending(song: Song) {
    log("💾 idbStorage.addPending", song.id)
    const db = await getDb()
    await db.put(PENDING, song)
  },

  async getPending(): Promise<PendingDrafts[]> {
    const db = await getDb()
    return (await db.getAll(PENDING)) as PendingDrafts[]
  },

  async clearPending() {
    log("💾 idbStorage.clearPending")
    const db = await getDb()
    await db.clear(PENDING)
  },

  async deleteSong(id: string) {
    log("💾 idbStorage.deleteSong", id)
    const db = await getDb()
    await db.delete(STORE, id)
  },

  async addPendingDelete(id: string) {
    log("💾 idbStorage.addPendingDelete", id)
    const db = await getDb()
    const entry = {
      id,
      _action: "delete" as const,
      deletedAt: new Date().toISOString(),
    }
    await db.put(PENDING, entry)
  },

  async removePending(id: string) {
    const db = await getDb()
    await db.delete(PENDING, id)
  },

  getLastUserId(): string | null {
    try {
      return localStorage.getItem(LAST_USER_KEY)
    } catch {
      return null
    }
  },

  setLastUserId(userId: string | null) {
    try {
      if (userId) localStorage.setItem(LAST_USER_KEY, userId)
      else localStorage.removeItem(LAST_USER_KEY)
    } catch {
      /* ignore */
    }
  },

  /**
   * If switching to a different authenticated user, wipe local songs/pending
   * so User A's data cannot leak into User B's cloud sync.
   * Returns true if stores were cleared.
   */
  async prepareForUser(userId: string | null): Promise<boolean> {
    const previous = idbStorage.getLastUserId()

    // Anonymous: keep local demo data; don't bind owner yet
    if (!userId) {
      return false
    }

    if (previous && previous !== userId) {
      await idbStorage.clearSongs()
      await idbStorage.clearPending()
      idbStorage.setLastUserId(userId)
      return true
    }

    idbStorage.setLastUserId(userId)
    return false
  },
}
