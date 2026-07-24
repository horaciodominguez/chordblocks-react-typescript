import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import {
  applyStageModeToDocument,
  readStageMode,
  writeStageMode,
  STAGE_MODE_STORAGE_KEY,
} from "@/modules/songs/utils/stageModePreference"

describe("stageModePreference", () => {
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

  it("defaults to off", () => {
    expect(readStageMode()).toBe(false)
  })

  it("persists on/off", () => {
    writeStageMode(true)
    expect(store.get(STAGE_MODE_STORAGE_KEY)).toBe("1")
    expect(readStageMode()).toBe(true)
    writeStageMode(false)
    expect(store.has(STAGE_MODE_STORAGE_KEY)).toBe(false)
    expect(readStageMode()).toBe(false)
  })

  it("toggles data-stage on documentElement when document exists", () => {
    const dataset: Record<string, string | undefined> = {}
    const bodyStyle = {
      props: new Map<string, string>(),
      setProperty(name: string, value: string) {
        this.props.set(name, value)
      },
      removeProperty(name: string) {
        this.props.delete(name)
      },
    }
    const el = {
      dataset,
      removeAttribute: (name: string) => {
        if (name === "data-stage") delete dataset.stage
      },
    }
    vi.stubGlobal("document", {
      documentElement: el,
      body: { style: bodyStyle },
      querySelector: () => null,
    })

    applyStageModeToDocument(true)
    expect(dataset.stage).toBe("on")
    expect(bodyStyle.props.get("background-color")).toBe("#000")
    applyStageModeToDocument(false)
    expect(dataset.stage).toBeUndefined()
    expect(bodyStyle.props.has("background-color")).toBe(false)
  })
})
