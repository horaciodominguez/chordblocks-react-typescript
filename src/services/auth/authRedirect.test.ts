import { describe, expect, it } from "vitest"
import {
  isPrivateNetworkOrigin,
  supabaseRedirectAllowlistHints,
} from "./authRedirect"

describe("isPrivateNetworkOrigin", () => {
  it("detects typical LAN hosts", () => {
    expect(isPrivateNetworkOrigin("http://192.168.1.2:5173")).toBe(true)
    expect(isPrivateNetworkOrigin("http://10.0.0.5:5173")).toBe(true)
    expect(isPrivateNetworkOrigin("http://172.28.96.1:5173")).toBe(true)
  })

  it("does not treat localhost as LAN phone testing", () => {
    expect(isPrivateNetworkOrigin("http://localhost:5173")).toBe(false)
    expect(isPrivateNetworkOrigin("http://127.0.0.1:5173")).toBe(false)
  })
})

describe("supabaseRedirectAllowlistHints", () => {
  it("puts the current origin first", () => {
    const hints = supabaseRedirectAllowlistHints("http://192.168.1.2:5173")
    expect(hints[0]).toBe("http://192.168.1.2:5173/**")
    expect(hints).toContain("http://localhost:5173/**")
  })
})
