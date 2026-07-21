import { describe, expect, it } from "vitest"
import { isNavItemActive, NAV_ITEMS, ROUTES } from "./navigation"

describe("navigation config", () => {
  it("marks Home only on exact root", () => {
    const home = NAV_ITEMS.find((i) => i.id === "home")!
    expect(isNavItemActive(home, "/")).toBe(true)
    expect(isNavItemActive(home, "/songs")).toBe(false)
  })

  it("marks Songs for song library and song routes", () => {
    const songs = NAV_ITEMS.find((i) => i.id === "songs")!
    expect(isNavItemActive(songs, ROUTES.songs)).toBe(true)
    expect(isNavItemActive(songs, "/song/abc")).toBe(true)
    expect(isNavItemActive(songs, "/song/abc/edit")).toBe(true)
    expect(isNavItemActive(songs, "/new")).toBe(true)
    expect(isNavItemActive(songs, "/")).toBe(false)
  })

  it("marks Sets for repertoire routes", () => {
    const sets = NAV_ITEMS.find((i) => i.id === "sets")!
    expect(isNavItemActive(sets, ROUTES.sets)).toBe(true)
    expect(isNavItemActive(sets, "/repertoires/xyz")).toBe(true)
    expect(isNavItemActive(sets, "/songs")).toBe(false)
  })
})
