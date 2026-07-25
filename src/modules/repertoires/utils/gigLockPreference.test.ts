import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import {
  GIG_LOCK_STORAGE_KEY,
  readGigLock,
  writeGigLock,
} from "./gigLockPreference"

describe("gigLockPreference", () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("defaults to unlocked", () => {
    expect(readGigLock()).toBe(false)
  })

  it("persists lock on/off", () => {
    writeGigLock(true)
    expect(store.get(GIG_LOCK_STORAGE_KEY)).toBe("1")
    expect(readGigLock()).toBe(true)
    writeGigLock(false)
    expect(store.has(GIG_LOCK_STORAGE_KEY)).toBe(false)
    expect(readGigLock()).toBe(false)
  })
})
