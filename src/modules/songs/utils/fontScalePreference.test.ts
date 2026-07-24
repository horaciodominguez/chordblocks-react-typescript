import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import {
  readAtrilFontScale,
  writeAtrilFontScale,
} from "@/modules/songs/utils/fontScalePreference"
import {
  ATRIL_FONT_SCALE_STORAGE_KEY,
  DEFAULT_ATRIL_FONT_SCALE,
} from "@/modules/songs/types/fontScale.types"

describe("fontScalePreference", () => {
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

  it("defaults to M", () => {
    expect(readAtrilFontScale()).toBe(DEFAULT_ATRIL_FONT_SCALE)
  })

  it("persists and reads a valid scale", () => {
    writeAtrilFontScale("xl")
    expect(store.get(ATRIL_FONT_SCALE_STORAGE_KEY)).toBe("xl")
    expect(readAtrilFontScale()).toBe("xl")
  })

  it("ignores invalid stored values", () => {
    store.set(ATRIL_FONT_SCALE_STORAGE_KEY, "huge")
    expect(readAtrilFontScale()).toBe(DEFAULT_ATRIL_FONT_SCALE)
  })
})
