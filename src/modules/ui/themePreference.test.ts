import { beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from "@/config/themes"
import {
  applyTheme,
  readThemePreference,
  writeThemePreference,
} from "@/modules/ui/themePreference"

function createStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    clear: () => store.clear(),
  }
}

describe("themePreference", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage())
  })

  it("defaults to dark when nothing is stored", () => {
    expect(readThemePreference()).toBe(DEFAULT_THEME_ID)
  })

  it("reads and writes theme preference", () => {
    writeThemePreference("light")
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light")
    expect(readThemePreference()).toBe("light")
  })

  it("ignores invalid stored values", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "invalid")
    expect(readThemePreference()).toBe(DEFAULT_THEME_ID)
  })
})

describe("applyTheme", () => {
  it("removes data-theme for dark and sets it for light", () => {
    const documentElement = {
      dataset: { theme: "light" } as DOMStringMap & { theme?: string },
    }
    const meta = {
      content: "#0a0a0a",
      setAttribute(_name: string, value: string) {
        this.content = value
      },
      getAttribute(name: string) {
        return name === "content" ? this.content : null
      },
    }

    vi.stubGlobal("document", {
      documentElement,
      querySelector: () => meta,
    })

    applyTheme("dark")
    expect(documentElement.dataset.theme).toBeUndefined()
    expect(meta.content).toBe("#0a0a0a")

    applyTheme("light")
    expect(documentElement.dataset.theme).toBe("light")
    expect(meta.content).toBe("#eef1f5")
  })
})
