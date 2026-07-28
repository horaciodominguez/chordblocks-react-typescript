import { describe, expect, it } from "vitest"
import type { Repertoire } from "../types/repertoire.types"
import { duplicateRepertoire } from "./repertoire.factory"

const source: Repertoire = {
  id: "rep-1",
  title: "Friday gig",
  date: "2026-07-31",
  isPinned: true,
  groups: [
    {
      id: "group-1",
      title: "First set",
      items: [
        {
          id: "item-1",
          songId: "song-1",
          transposeSemitones: 2,
          notes: "Count in",
        },
      ],
    },
  ],
  createdAt: "2026-07-28T12:00:00.000Z",
  updatedAt: "2026-07-28T12:00:00.000Z",
}

describe("duplicateRepertoire", () => {
  it("copies set content with fresh entity IDs and new metadata", () => {
    const copy = duplicateRepertoire(source)

    expect(copy.title).toBe("Friday gig copy")
    expect(copy.id).not.toBe(source.id)
    expect(copy.createdAt).not.toBe(source.createdAt)
    expect(copy.updatedAt).not.toBe(source.updatedAt)
    expect(copy.date).toBeUndefined()
    expect(copy.isPinned).toBeUndefined()
    expect(copy.groups[0].id).not.toBe(source.groups[0].id)
    expect(copy.groups[0].items[0].id).not.toBe(
      source.groups[0].items[0].id,
    )
    expect(copy.groups[0].title).toBe("First set")
    expect(copy.groups[0].items[0]).toMatchObject({
      songId: "song-1",
      transposeSemitones: 2,
      notes: "Count in",
    })
  })
})
