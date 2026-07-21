import { describe, it, expect } from "vitest"
import {
  classifyPendingByContent,
  isSeedRelated,
  planContentMerge,
  planDuplicateGroups,
  planResolutionMerge,
} from "@/services/sync/contentIdentity"
import { remapSongIdInRepertoire } from "@/services/sync/remapSongIds"
import {
  normalizeArtist,
  normalizeSongTitle,
  songIdentityKey,
} from "@/modules/io/utils/normalizeTitle"
import { cloneSongWithNewIds } from "@/modules/songs/utils/seedLocalSongs"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

function song(partial: Partial<Song> & { id: string; updatedAt: string }): Song {
  return {
    title: "t",
    artist: "a",
    genre: "g",
    year: 2020,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    imageUrl: null,
    imageBase64: null,
    songSections: [],
    createdAt: partial.updatedAt,
    ...partial,
  }
}

describe("normalize identity", () => {
  it("normalizes title and artist", () => {
    expect(normalizeSongTitle("  Valerie  ")).toBe("valerie")
    expect(normalizeArtist("  Amy Winehouse ")).toBe("amy winehouse")
    expect(songIdentityKey("Valerie", "Amy")).toBe("valerie\0amy")
  })
})

describe("cloneSongWithNewIds seedOriginId", () => {
  it("stamps seedOriginId from template id", () => {
    const template = song({
      id: "template-1",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const clone = cloneSongWithNewIds(template)
    expect(clone.id).not.toBe(template.id)
    expect(clone.seedOriginId).toBe("template-1")
  })
})

describe("isSeedRelated", () => {
  it("true when seedOriginId set", () => {
    expect(
      isSeedRelated(
        song({
          id: "x",
          seedOriginId: "origin",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
      ),
    ).toBe(true)
  })

  it("true when title+artist matches a mockup template", () => {
    expect(
      isSeedRelated(
        song({
          id: "x",
          title: "Knockin' on Heaven's Door",
          artist: "Bob Dylan",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
      ),
    ).toBe(true)
  })

  it("false for arbitrary user song", () => {
    expect(
      isSeedRelated(
        song({
          id: "x",
          title: "My Original",
          artist: "Me",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
      ),
    ).toBe(false)
  })
})

describe("planContentMerge", () => {
  it("keeps remote id and newer local content", () => {
    const local = song({
      id: "local-1",
      title: "Foo",
      artist: "Bar",
      updatedAt: "2026-03-01T00:00:00.000Z",
      seedOriginId: "seed",
    })
    const remote = song({
      id: "remote-1",
      title: "Foo",
      artist: "Bar",
      updatedAt: "2026-01-01T00:00:00.000Z",
      seedOriginId: "seed",
    })
    const plan = planContentMerge(local, remote)
    expect(plan.keeperId).toBe("remote-1")
    expect(plan.discardId).toBe("local-1")
    expect(plan.winner.id).toBe("remote-1")
    expect(plan.winner.updatedAt).toBe("2026-03-01T00:00:00.000Z")
    expect(plan.upsertRemote).toBe(true)
  })

  it("keeps remote content on tie", () => {
    const local = song({
      id: "local-1",
      title: "Foo",
      artist: "Bar",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const remote = song({
      id: "remote-1",
      title: "Foo cloud",
      artist: "Bar",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const plan = planContentMerge(local, remote)
    expect(plan.winner.title).toBe("Foo cloud")
    expect(plan.upsertRemote).toBe(false)
  })
})

describe("classifyPendingByContent", () => {
  it("auto-merges seed-related pending vs remote", () => {
    const local = song({
      id: "local-seed",
      title: "Knockin' on Heaven's Door",
      artist: "Bob Dylan",
      updatedAt: "2026-02-01T00:00:00.000Z",
      seedOriginId: "01b106ea-5559-4294-8414-0cb674b0cfb3",
    })
    const remote = song({
      id: "remote-seed",
      title: "Knockin' on Heaven's Door",
      artist: "Bob Dylan",
      updatedAt: "2026-01-01T00:00:00.000Z",
      seedOriginId: "01b106ea-5559-4294-8414-0cb674b0cfb3",
    })
    const result = classifyPendingByContent([local], [remote])
    expect(result.autoMerges).toHaveLength(1)
    expect(result.userConflicts).toHaveLength(0)
    expect(result.unmatchedPending).toHaveLength(0)
  })

  it("flags user↔user conflicts", () => {
    const local = song({
      id: "local-u",
      title: "My Tune",
      artist: "Me",
      updatedAt: "2026-02-01T00:00:00.000Z",
    })
    const remote = song({
      id: "remote-u",
      title: "My Tune",
      artist: "Me",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const result = classifyPendingByContent([local], [remote])
    expect(result.userConflicts).toHaveLength(1)
    expect(result.userConflicts[0].source).toBe("pending_vs_remote")
    expect(result.autoMerges).toHaveLength(0)
  })

  it("leaves unmatched pending as new uploads", () => {
    const local = song({
      id: "new-1",
      title: "Brand New",
      artist: "Artist",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const result = classifyPendingByContent([local], [])
    expect(result.unmatchedPending.map((s) => s.id)).toEqual(["new-1"])
  })
})

describe("planDuplicateGroups", () => {
  it("auto-dedupes seed duplicates keeping newest id as keeper", () => {
    const older = song({
      id: "a",
      title: "Knockin' on Heaven's Door",
      artist: "Bob Dylan",
      updatedAt: "2026-01-01T00:00:00.000Z",
      seedOriginId: "origin",
    })
    const newer = song({
      id: "b",
      title: "Knockin' on Heaven's Door",
      artist: "Bob Dylan",
      updatedAt: "2026-03-01T00:00:00.000Z",
      seedOriginId: "origin",
    })
    const plan = planDuplicateGroups([older, newer])
    expect(plan.userConflicts).toHaveLength(0)
    expect(plan.autoMerges).toHaveLength(1)
    expect(plan.autoMerges[0].keeperId).toBe("b")
    expect(plan.autoMerges[0].discardId).toBe("a")
  })

  it("emits user conflicts for duplicate user songs", () => {
    const a = song({
      id: "u1",
      title: "Original",
      artist: "Band",
      updatedAt: "2026-03-01T00:00:00.000Z",
    })
    const b = song({
      id: "u2",
      title: "Original",
      artist: "Band",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })
    const plan = planDuplicateGroups([a, b])
    expect(plan.autoMerges).toHaveLength(0)
    expect(plan.userConflicts).toHaveLength(1)
    expect(plan.userConflicts[0].songB.id).toBe("u1")
    expect(plan.userConflicts[0].songA.id).toBe("u2")
  })
})

describe("planResolutionMerge", () => {
  it("returns null for keepBoth", () => {
    const conflict = {
      id: "c",
      songA: song({ id: "a", updatedAt: "2026-02-01T00:00:00.000Z" }),
      songB: song({ id: "b", updatedAt: "2026-01-01T00:00:00.000Z" }),
      source: "pending_vs_remote" as const,
    }
    expect(planResolutionMerge(conflict, "keepBoth")).toBeNull()
    const merge = planResolutionMerge(conflict, "keepNewest")
    expect(merge?.keeperId).toBe("b")
    expect(merge?.upsertRemote).toBe(true)
  })
})

describe("remapSongIdInRepertoire", () => {
  it("rewrites songId refs and bumps updatedAt", () => {
    const rep: Repertoire = {
      id: "r1",
      title: "Set",
      groups: [
        {
          id: "g1",
          title: "",
          items: [
            { id: "i1", songId: "old", transposeSemitones: 0 },
            { id: "i2", songId: "keep", transposeSemitones: 1 },
          ],
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }
    const next = remapSongIdInRepertoire(rep, "old", "new")
    expect(next.groups[0].items[0].songId).toBe("new")
    expect(next.groups[0].items[1].songId).toBe("keep")
    expect(next.updatedAt).not.toBe(rep.updatedAt)
  })
})
