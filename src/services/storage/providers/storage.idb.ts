import { openDB } from "idb"
import type { Song } from "@/modules/songs/types/song.types"
import type { PendingDrafts } from "@/services/storage/types/storage.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import type { PendingRepertoireDrafts } from "@/modules/repertoires/types/pending.types"

const DB_NAME = "ChordBlocks"
const STORE = "songs"
const PENDING = "pending"
const REPERTOIRES = "repertoires"
const PENDING_REPERTOIRES = "pendingRepertoires"
const LAST_USER_KEY = "chordblocks:lastUserId"
const DB_VERSION = 3

function log(...args: unknown[]) {
  if (import.meta.env.DEV) console.log(...args)
}

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(PENDING)) {
        db.createObjectStore(PENDING, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(REPERTOIRES)) {
        db.createObjectStore(REPERTOIRES, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(PENDING_REPERTOIRES)) {
        db.createObjectStore(PENDING_REPERTOIRES, { keyPath: "id" })
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

  // --- Repertoires ---

  async getRepertoires(): Promise<Repertoire[]> {
    log("💾 idbStorage.getRepertoires")
    const db = await getDb()
    return (await db.getAll(REPERTOIRES)) as Repertoire[]
  },

  async saveRepertoire(rep: Repertoire) {
    log("💾 idbStorage.saveRepertoire", rep.id)
    const db = await getDb()
    await db.put(REPERTOIRES, rep)
  },

  async getRepertoire(id: string): Promise<Repertoire | undefined> {
    const db = await getDb()
    return (await db.get(REPERTOIRES, id)) as Repertoire | undefined
  },

  async deleteRepertoire(id: string) {
    log("💾 idbStorage.deleteRepertoire", id)
    const db = await getDb()
    await db.delete(REPERTOIRES, id)
  },

  async clearRepertoires() {
    const db = await getDb()
    await db.clear(REPERTOIRES)
  },

  async addPendingRepertoire(rep: Repertoire) {
    const db = await getDb()
    await db.put(PENDING_REPERTOIRES, rep)
  },

  async getPendingRepertoires(): Promise<PendingRepertoireDrafts[]> {
    const db = await getDb()
    return (await db.getAll(PENDING_REPERTOIRES)) as PendingRepertoireDrafts[]
  },

  async clearPendingRepertoires() {
    const db = await getDb()
    await db.clear(PENDING_REPERTOIRES)
  },

  async addPendingRepertoireDelete(id: string) {
    const db = await getDb()
    await db.put(PENDING_REPERTOIRES, {
      id,
      _action: "delete" as const,
      deletedAt: new Date().toISOString(),
    })
  },

  async removePendingRepertoire(id: string) {
    const db = await getDb()
    await db.delete(PENDING_REPERTOIRES, id)
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

    if (!userId) {
      return false
    }

    if (previous && previous !== userId) {
      await idbStorage.clearSongs()
      await idbStorage.clearPending()
      await idbStorage.clearRepertoires()
      await idbStorage.clearPendingRepertoires()
      idbStorage.setLastUserId(userId)
      return true
    }

    idbStorage.setLastUserId(userId)
    return false
  },
}
