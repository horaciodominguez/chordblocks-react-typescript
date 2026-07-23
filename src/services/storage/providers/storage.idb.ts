import { openDB, type IDBPDatabase } from "idb"
import type { Song } from "@/modules/songs/types/song.types"
import {
  isPendingDelete,
  type PendingDelete,
  type PendingDrafts,
} from "@/services/storage/types/storage.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"
import {
  isPendingRepertoireDelete,
  type PendingRepertoireDelete,
  type PendingRepertoireDrafts,
} from "@/modules/repertoires/types/pending.types"

const DB_NAME = "ChordBlocks"
const STORE = "songs"
/** Pending song upserts only (never deletes). */
const PENDING = "pending"
/** Pending song deletes — separate store so save/delete cannot overwrite each other. */
const PENDING_DELETES = "pendingDeletes"
const REPERTOIRES = "repertoires"
/** Pending repertoire upserts only. */
const PENDING_REPERTOIRES = "pendingRepertoires"
/** Pending repertoire deletes. */
const PENDING_REPERTOIRE_DELETES = "pendingRepertoireDeletes"
const LAST_USER_KEY = "chordblocks:lastUserId"
/** v4: split pending save vs pending delete into separate stores. */
const DB_VERSION = 4

type ChordBlocksDB = IDBPDatabase

function log(...args: unknown[]) {
  if (import.meta.env.DEV) console.log(...args)
}

let migrateOnce: Promise<void> | null = null

async function migrateSplitPendingQueues(db: ChordBlocksDB): Promise<void> {
  const mixedSongs = (await db.getAll(PENDING)) as PendingDrafts[]
  for (const item of mixedSongs) {
    if (isPendingDelete(item)) {
      await db.put(PENDING_DELETES, item)
      await db.delete(PENDING, item.id)
    }
  }

  const mixedReps = (await db.getAll(
    PENDING_REPERTOIRES,
  )) as PendingRepertoireDrafts[]
  for (const item of mixedReps) {
    if (isPendingRepertoireDelete(item)) {
      await db.put(PENDING_REPERTOIRE_DELETES, item)
      await db.delete(PENDING_REPERTOIRES, item.id)
    }
  }
}

async function getDb() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
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
      if (oldVersion < 4) {
        if (!db.objectStoreNames.contains(PENDING_DELETES)) {
          db.createObjectStore(PENDING_DELETES, { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains(PENDING_REPERTOIRE_DELETES)) {
          db.createObjectStore(PENDING_REPERTOIRE_DELETES, {
            keyPath: "id",
          })
        }
      }
    },
  })

  if (!migrateOnce) {
    migrateOnce = migrateSplitPendingQueues(db).catch((err) => {
      migrateOnce = null
      console.error("pending queue migration failed:", err)
      throw err
    })
  }
  await migrateOnce
  return db
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

  /**
   * Queue a song upsert. Cancels any pending delete for the same id
   * (offline recreate / edit after delete intent).
   */
  async addPending(song: Song) {
    log("💾 idbStorage.addPending", song.id)
    const db = await getDb()
    await db.delete(PENDING_DELETES, song.id)
    await db.put(PENDING, song)
  },

  /**
   * Combined pending queue: deletes first, then saves.
   * Callers use isPendingDelete to branch.
   */
  async getPending(): Promise<PendingDrafts[]> {
    const db = await getDb()
    const deletes = (await db.getAll(PENDING_DELETES)) as PendingDelete[]
    const saves = (await db.getAll(PENDING)) as Song[]
    const cleanSaves = saves.filter((s) => !isPendingDelete(s as PendingDrafts))
    return [...deletes, ...cleanSaves]
  },

  async clearPending() {
    log("💾 idbStorage.clearPending")
    const db = await getDb()
    await db.clear(PENDING)
    await db.clear(PENDING_DELETES)
  },

  async deleteSong(id: string) {
    log("💾 idbStorage.deleteSong", id)
    const db = await getDb()
    await db.delete(STORE, id)
  },

  /**
   * Queue a song delete. Cancels any pending save for the same id
   * (offline delete after edit — delete is the latest intent).
   */
  async addPendingDelete(id: string) {
    log("💾 idbStorage.addPendingDelete", id)
    const db = await getDb()
    await db.delete(PENDING, id)
    const entry: PendingDelete = {
      id,
      _action: "delete",
      deletedAt: new Date().toISOString(),
    }
    await db.put(PENDING_DELETES, entry)
  },

  async removePending(id: string) {
    const db = await getDb()
    await db.delete(PENDING, id)
    await db.delete(PENDING_DELETES, id)
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
    await db.delete(PENDING_REPERTOIRE_DELETES, rep.id)
    await db.put(PENDING_REPERTOIRES, rep)
  },

  async getPendingRepertoires(): Promise<PendingRepertoireDrafts[]> {
    const db = await getDb()
    const deletes = (await db.getAll(
      PENDING_REPERTOIRE_DELETES,
    )) as PendingRepertoireDelete[]
    const saves = (await db.getAll(PENDING_REPERTOIRES)) as Repertoire[]
    const cleanSaves = saves.filter(
      (r) => !isPendingRepertoireDelete(r as PendingRepertoireDrafts),
    )
    return [...deletes, ...cleanSaves]
  },

  async clearPendingRepertoires() {
    const db = await getDb()
    await db.clear(PENDING_REPERTOIRES)
    await db.clear(PENDING_REPERTOIRE_DELETES)
  },

  async addPendingRepertoireDelete(id: string) {
    const db = await getDb()
    await db.delete(PENDING_REPERTOIRES, id)
    const entry: PendingRepertoireDelete = {
      id,
      _action: "delete",
      deletedAt: new Date().toISOString(),
    }
    await db.put(PENDING_REPERTOIRE_DELETES, entry)
  },

  async removePendingRepertoire(id: string) {
    const db = await getDb()
    await db.delete(PENDING_REPERTOIRES, id)
    await db.delete(PENDING_REPERTOIRE_DELETES, id)
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

  /** Wipe all local songs/sets/pending and forget last user (explicit logout clear). */
  async clearAllLocalData(): Promise<void> {
    log("💾 idbStorage.clearAllLocalData")
    await idbStorage.clearSongs()
    await idbStorage.clearPending()
    await idbStorage.clearRepertoires()
    await idbStorage.clearPendingRepertoires()
    idbStorage.setLastUserId(null)
  },

  /**
   * If switching to a different authenticated user, wipe local songs/pending
   * so User A's data cannot leak into User B's cloud sync.
   * Logout without clear does not wipe (offline-first guest continues with local data).
   * Returns true if stores were cleared.
   */
  async prepareForUser(userId: string | null): Promise<boolean> {
    const previous = idbStorage.getLastUserId()

    if (!userId) {
      return false
    }

    if (previous && previous !== userId) {
      await idbStorage.clearAllLocalData()
      idbStorage.setLastUserId(userId)
      return true
    }

    idbStorage.setLastUserId(userId)
    return false
  },
}
