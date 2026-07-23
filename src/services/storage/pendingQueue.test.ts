import { describe, expect, it } from "vitest"
import {
  isPendingDelete,
  type PendingDelete,
  type PendingDrafts,
} from "@/services/storage/types/storage.types"
import {
  isPendingRepertoireDelete,
  type PendingRepertoireDelete,
  type PendingRepertoireDrafts,
} from "@/modules/repertoires/types/pending.types"

/**
 * Documents S0.7 queue merge order: deletes listed before saves.
 * (idbStorage.getPending / getPendingRepertoires implement this.)
 */
function mergePendingQueues<TSave, TDelete extends { id: string }>(
  saves: TSave[],
  deletes: TDelete[],
): Array<TSave | TDelete> {
  return [...deletes, ...saves]
}

describe("pending save vs delete separation (S0.7)", () => {
  it("isPendingDelete discriminates delete markers", () => {
    const del: PendingDelete = {
      id: "a",
      _action: "delete",
      deletedAt: "2026-01-01T00:00:00.000Z",
    }
    const song = {
      id: "a",
      title: "T",
      artist: "A",
      genre: "g",
      year: 2020,
      timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
      imageUrl: null,
      imageBase64: null,
      songSections: [],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }
    expect(isPendingDelete(del)).toBe(true)
    expect(isPendingDelete(song as PendingDrafts)).toBe(false)
  })

  it("merge lists deletes before saves for sync flush order", () => {
    const saves = [{ id: "s1" }, { id: "s2" }]
    const deletes: PendingDelete[] = [
      {
        id: "d1",
        _action: "delete",
        deletedAt: "2026-01-01T00:00:00.000Z",
      },
    ]
    const merged = mergePendingQueues(saves, deletes)
    expect(isPendingDelete(merged[0] as PendingDrafts)).toBe(true)
    expect(merged.map((m) => m.id)).toEqual(["d1", "s1", "s2"])
  })

  it("repertoire pending delete discriminator", () => {
    const del: PendingRepertoireDelete = {
      id: "r1",
      _action: "delete",
      deletedAt: "2026-01-01T00:00:00.000Z",
    }
    expect(isPendingRepertoireDelete(del)).toBe(true)
    expect(
      isPendingRepertoireDelete({
        id: "r1",
        title: "Set",
        groups: [],
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      } as PendingRepertoireDrafts),
    ).toBe(false)
  })
})
