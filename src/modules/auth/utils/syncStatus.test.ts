import { describe, expect, it } from "vitest"
import {
  describeSyncStatus,
  getPendingQueueCount,
} from "@/modules/auth/utils/syncStatus"

describe("getPendingQueueCount", () => {
  it("sums song and repertoire pending queues", async () => {
    const n = await getPendingQueueCount({
      getPending: async () => [{}, {}],
      getPendingRepertoires: async () => [{}],
    })
    expect(n).toBe(3)
  })
})

describe("describeSyncStatus", () => {
  it("prefers offline over syncing", () => {
    const v = describeSyncStatus({
      online: false,
      syncing: true,
      pendingCount: 2,
      signedIn: true,
    })
    expect(v.kind).toBe("offline")
    expect(v.label).toBe("Offline")
  })

  it("shows syncing when online", () => {
    expect(
      describeSyncStatus({
        online: true,
        syncing: true,
        pendingCount: 0,
        signedIn: true,
      }).kind,
    ).toBe("syncing")
  })

  it("shows pending count", () => {
    const v = describeSyncStatus({
      online: true,
      syncing: false,
      pendingCount: 4,
      signedIn: false,
    })
    expect(v.kind).toBe("pending")
    expect(v.label).toBe("4 pending")
  })

  it("shows synced vs local only", () => {
    expect(
      describeSyncStatus({
        online: true,
        syncing: false,
        pendingCount: 0,
        signedIn: true,
      }).kind,
    ).toBe("synced")
    expect(
      describeSyncStatus({
        online: true,
        syncing: false,
        pendingCount: 0,
        signedIn: false,
      }).kind,
    ).toBe("local")
  })
})
