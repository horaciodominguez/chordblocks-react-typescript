import { describe, it, expect } from "vitest"
import { planMembershipSync, isNewer } from "@/services/sync/membership"
import { RepertoireSchema } from "@/modules/repertoires/schemas/repertoire.schema"
import {
  createEmptyRepertoire,
  touchRepertoire,
} from "@/modules/repertoires/utils/repertoire.factory"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

function rep(
  partial: Partial<Repertoire> & { id: string; updatedAt: string },
): Repertoire {
  return {
    title: "Set",
    groups: [],
    createdAt: partial.updatedAt,
    ...partial,
  }
}

describe("repertoire factory + schema", () => {
  it("createEmptyRepertoire produces a valid repertoire", () => {
    const created = createEmptyRepertoire("Noche X")
    const parsed = RepertoireSchema.parse(created)
    expect(parsed.title).toBe("Noche X")
    expect(parsed.groups).toHaveLength(1)
    expect(parsed.groups[0].items).toEqual([])
  })

  it("touchRepertoire bumps updatedAt without mutating original timestamps identity wrongly", () => {
    const created = createEmptyRepertoire()
    const touched = touchRepertoire(created)
    expect(new Date(touched.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(created.updatedAt).getTime(),
    )
    expect(touched.id).toBe(created.id)
  })
})

describe("repertoire membership sync planner", () => {
  it("keeps remote when local is older", () => {
    const local = [
      rep({ id: "1", title: "Local", updatedAt: "2026-01-01T00:00:00.000Z" }),
    ]
    const remote = [
      rep({ id: "1", title: "Remote", updatedAt: "2026-01-02T00:00:00.000Z" }),
    ]
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.toWriteIdb[0].title).toBe("Remote")
    expect(plan.toUpsertRemote).toHaveLength(0)
  })

  it("upserts local when newer than remote", () => {
    const local = [
      rep({ id: "1", title: "Local", updatedAt: "2026-01-03T00:00:00.000Z" }),
    ]
    const remote = [
      rep({ id: "1", title: "Remote", updatedAt: "2026-01-02T00:00:00.000Z" }),
    ]
    expect(isNewer(local[0], remote[0])).toBe(true)
    const plan = planMembershipSync(local, remote, new Set())
    expect(plan.toUpsertRemote[0].title).toBe("Local")
    expect(plan.toWriteIdb[0].title).toBe("Local")
  })

  it("treats local-only without pending as orphan", () => {
    const local = [
      rep({
        id: "orphan",
        title: "Orphan",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    ]
    const plan = planMembershipSync(local, [], new Set())
    expect(plan.orphanLocalIds).toEqual(["orphan"])
  })

  it("upserts local-only when pending save", () => {
    const local = [
      rep({
        id: "p1",
        title: "Pending",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    ]
    const plan = planMembershipSync(local, [], new Set(["p1"]))
    expect(plan.toUpsertRemote).toHaveLength(1)
    expect(plan.orphanLocalIds).toHaveLength(0)
  })
})
