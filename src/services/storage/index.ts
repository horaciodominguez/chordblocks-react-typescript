import { idbStorage } from "./providers/storage.idb"
export { supabaseStorage } from "./providers/storage.supabase"

import type { LocalStorageApi } from "./types/storage.types"

export const storage: LocalStorageApi = idbStorage
