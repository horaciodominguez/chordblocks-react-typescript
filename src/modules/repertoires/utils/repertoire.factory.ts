import { v4 as uuidv4 } from "uuid"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

export function touchRepertoire(rep: Repertoire): Repertoire {
  return {
    ...rep,
    updatedAt: new Date().toISOString(),
    createdAt: rep.createdAt || new Date().toISOString(),
  }
}

export function createEmptyRepertoire(title = "New set"): Repertoire {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title,
    groups: [
      {
        id: uuidv4(),
        title: "",
        items: [],
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
}
