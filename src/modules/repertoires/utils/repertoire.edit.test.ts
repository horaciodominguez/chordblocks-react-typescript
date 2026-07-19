import { describe, expect, it } from "vitest"
import type { Repertoire, RepertoireGroup } from "../types/repertoire.types"
import {
  addGroup,
  addItemToGroup,
  createRepertoireGroup,
  createRepertoireItem,
  findContainerId,
  groupDroppableId,
  moveGroup,
  removeEmptyGroup,
  removeItem,
  reorderItem,
  setGroupTitle,
} from "./repertoire.edit"

function makeRep(groups: RepertoireGroup[]): Repertoire {
  return {
    id: "rep-1",
    title: "Gig",
    groups,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }
}

describe("repertoire.edit", () => {
  it("adds an item to a group", () => {
    const g = createRepertoireGroup("A")
    const rep = makeRep([g])
    const next = addItemToGroup(rep, g.id, "song-1")
    expect(next.groups[0].items).toHaveLength(1)
    expect(next.groups[0].items[0].songId).toBe("song-1")
    expect(next.groups[0].items[0].transposeSemitones).toBe(0)
  })

  it("removes an item", () => {
    const item = createRepertoireItem("song-1")
    const g = { ...createRepertoireGroup(""), items: [item] }
    const next = removeItem(makeRep([g]), item.id)
    expect(next.groups[0].items).toHaveLength(0)
  })

  it("renames a group and adds/removes empty groups", () => {
    const g1 = createRepertoireGroup("")
    let rep = makeRep([g1])
    rep = setGroupTitle(rep, g1.id, "English")
    expect(rep.groups[0].title).toBe("English")

    rep = addGroup(rep, "Latinos")
    expect(rep.groups).toHaveLength(2)

    const emptyId = rep.groups[1].id
    const removed = removeEmptyGroup(rep, emptyId)
    expect(removed?.groups).toHaveLength(1)

    // Cannot remove the last remaining group
    expect(removeEmptyGroup(removed!, removed!.groups[0].id)).toBeNull()

    const withItem = addItemToGroup(makeRep([g1]), g1.id, "song-1")
    expect(removeEmptyGroup(withItem, g1.id)).toBeNull()
  })

  it("moves groups up/down", () => {
    const a = createRepertoireGroup("A")
    const b = createRepertoireGroup("B")
    let rep = makeRep([a, b])
    rep = moveGroup(rep, a.id, 1)
    expect(rep.groups.map((g) => g.title)).toEqual(["B", "A"])
    rep = moveGroup(rep, a.id, -1)
    expect(rep.groups.map((g) => g.title)).toEqual(["A", "B"])
  })

  it("reorders items within a group", () => {
    const i1 = createRepertoireItem("s1")
    const i2 = createRepertoireItem("s2")
    const i3 = createRepertoireItem("s3")
    const g = { ...createRepertoireGroup("A"), items: [i1, i2, i3] }
    const next = reorderItem([g], i1.id, i3.id)
    expect(next?.[0].items.map((i) => i.id)).toEqual([i2.id, i3.id, i1.id])
  })

  it("moves an item to another group", () => {
    const i1 = createRepertoireItem("s1")
    const i2 = createRepertoireItem("s2")
    const g1 = { ...createRepertoireGroup("A"), items: [i1] }
    const g2 = { ...createRepertoireGroup("B"), items: [i2] }
    const next = reorderItem([g1, g2], i1.id, i2.id)
    expect(next?.[0].items).toHaveLength(0)
    expect(next?.[1].items.map((i) => i.songId)).toEqual(["s1", "s2"])
  })

  it("drops onto an empty group droppable", () => {
    const i1 = createRepertoireItem("s1")
    const g1 = { ...createRepertoireGroup("A"), items: [i1] }
    const g2 = createRepertoireGroup("B")
    expect(findContainerId([g1, g2], groupDroppableId(g2.id))).toBe(g2.id)
    const next = reorderItem([g1, g2], i1.id, groupDroppableId(g2.id))
    expect(next?.[0].items).toHaveLength(0)
    expect(next?.[1].items.map((i) => i.songId)).toEqual(["s1"])
  })
})
