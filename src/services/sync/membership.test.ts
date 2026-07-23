import { describe, it, expect } from "vitest"
import { isNewer, planMembershipSync } from "@/services/sync/membership"
import { cloneSongWithNewIds } from "@/modules/songs/utils/seedLocalSongs"
import type { Song } from "@/modules/songs/types/song.types"

function song(
  partial: Partial<Song> & { id: string; updatedAt: string },
): Song {
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

describe("isNewer", () => {
  it("returns true when local is strictly newer", () => {
    const a = song({ id: "1", updatedAt: "2026-01-02T00:00:00.000Z" })
    const b = song({ id: "1", updatedAt: "2026-01-01T00:00:00.000Z" })
    expect(isNewer(a, b)).toBe(true)
    expect(isNewer(b, a)).toBe(false)
  })

  it("returns false on equal timestamps (remote wins via caller)", () => {
    const a = song({ id: "1", updatedAt: "2026-01-01T00:00:00.000Z" })
    const b = song({ id: "1", updatedAt: "2026-01-01T00:00:00.000Z" })
    expect(isNewer(a, b)).toBe(false)
  })
})

describe("planMembershipSync", () => {
  it("keeps remote when local is older", () => {
    const remote = [
      song({ id: "a", title: "cloud", updatedAt: "2026-02-01T00:00:00.000Z" }),
    ]
    const local = [
      song({ id: "a", title: "mock", updatedAt: "2026-01-01T00:00:00.000Z" }),
    ]
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.toWriteIdb[0].title).toBe("cloud")
    expect(plan.toUpsertRemote).toHaveLength(0)
    expect(plan.orphanLocalIds).toHaveLength(0)
  })

  it("uploads local when newer than remote", () => {
    const remote = [
      song({ id: "a", title: "cloud", updatedAt: "2026-01-01T00:00:00.000Z" }),
    ]
    const local = [
      song({ id: "a", title: "edit", updatedAt: "2026-03-01T00:00:00.000Z" }),
    ]
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.toWriteIdb[0].title).toBe("edit")
    expect(plan.toUpsertRemote[0].title).toBe("edit")
  })

  it("purges local-only orphans without pending", () => {
    const remote: Song[] = []
    const local = [
      song({ id: "orphan", updatedAt: "2026-01-01T00:00:00.000Z" }),
    ]
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.orphanLocalIds).toEqual(["orphan"])
    expect(plan.toWriteIdb).toHaveLength(0)
  })

  it("keeps local-only when in pendingSaveIds", () => {
    const remote: Song[] = []
    const local = [song({ id: "new1", updatedAt: "2026-01-01T00:00:00.000Z" })]
    const plan = planMembershipSync(local, remote, new Set(["new1"]))
    expect(plan.orphanLocalIds).toHaveLength(0)
    expect(plan.toUpsertRemote[0].id).toBe("new1")
  })

  it("does not resurrect deleted remote song from stale local", () => {
    // remote no longer has id "gone"; local still has it, no pending
    const remote = [song({ id: "keep", updatedAt: "2026-02-01T00:00:00.000Z" })]
    const local = [
      song({ id: "keep", updatedAt: "2026-01-01T00:00:00.000Z" }),
      song({ id: "gone", updatedAt: "2026-03-01T00:00:00.000Z" }),
    ]
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.toWriteIdb.map((s) => s.id)).toEqual(["keep"])
    expect(plan.orphanLocalIds).toEqual(["gone"])
    expect(plan.toUpsertRemote.find((s) => s.id === "gone")).toBeUndefined()
  })

  it("keeps holdIds local without upsert or orphan", () => {
    const remote: Song[] = []
    const local = [song({ id: "held", updatedAt: "2026-01-01T00:00:00.000Z" })]
    const plan = planMembershipSync(
      local,
      remote,
      new Set(["held"]),
      new Set(["held"]),
    )
    expect(plan.orphanLocalIds).toHaveLength(0)
    expect(plan.toUpsertRemote).toHaveLength(0)
    expect(plan.toWriteIdb.map((s) => s.id)).toEqual(["held"])
  })
})

describe("cloneSongWithNewIds", () => {
  it("assigns new ids to song and nested entities", () => {
    const template = song({
      id: "fixed-song",
      updatedAt: "2026-01-01T00:00:00.000Z",
      songSections: [
        {
          id: "sec",
          type: "VERSE",
          repeats: 1,
          bars: [
            {
              id: "bar",
              position: 1,
              blocks: [
                {
                  id: "blk",
                  type: "chord",
                  duration: 4,
                  position: 1,
                  chord: { name: "C" },
                },
              ],
            },
          ],
        },
      ],
    })
    const clone = cloneSongWithNewIds(template)
    expect(clone.id).not.toBe(template.id)
    expect(clone.seedOriginId).toBe("fixed-song")
    expect(clone.songSections[0].id).not.toBe("sec")
    expect(clone.songSections[0].bars[0].id).not.toBe("bar")
    expect(clone.songSections[0].bars[0].blocks[0].id).not.toBe("blk")
    expect(clone.title).toBe(template.title)
  })
})
