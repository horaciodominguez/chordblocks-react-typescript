import { storageProviderIdb } from "./providers/storage.idb"
import type { StorageProvider } from "./types/storage.types"

export const storage: StorageProvider = storageProviderIdb
