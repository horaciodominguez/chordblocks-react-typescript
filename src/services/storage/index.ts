import { storageProviderIdb } from "./providers/storage.idb"
export { supabaseStorage } from "./providers/storage.supabase"

import type { StorageProvider } from "./types/storage.types"

export const storage: StorageProvider = storageProviderIdb
