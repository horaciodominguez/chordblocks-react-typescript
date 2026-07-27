import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  readChordPreviewPreference,
  writeChordPreviewPreference,
  CHORD_PREVIEW_STORAGE_KEY,
} from "@/modules/chords/audio/chordPreviewPreference"

describe("chordPreviewPreference", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null
      },
      setItem(key: string, value: string) {
        this.store[key] = value
      },
      removeItem(key: string) {
        delete this.store[key]
      },
    })
  })

  it("defaults to on", () => {
    expect(readChordPreviewPreference()).toBe(true)
  })

  it("persists disabled state", () => {
    writeChordPreviewPreference(false)
    expect(readChordPreviewPreference()).toBe(false)
    writeChordPreviewPreference(true)
    expect(readChordPreviewPreference()).toBe(true)
  })

  it("persists enabled state explicitly", () => {
    writeChordPreviewPreference(true)
    expect(localStorage.getItem(CHORD_PREVIEW_STORAGE_KEY)).toBe("1")
    expect(readChordPreviewPreference()).toBe(true)
    writeChordPreviewPreference(false)
    expect(readChordPreviewPreference()).toBe(false)
  })
})
