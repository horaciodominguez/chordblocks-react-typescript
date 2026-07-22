import { describe, expect, it } from "vitest"
import {
  SyncAbortedError,
  isSyncAbortError,
  isSyncTimeoutError,
  throwIfAborted,
} from "./abort"

describe("throwIfAborted", () => {
  it("does nothing when signal is undefined", () => {
    expect(() => throwIfAborted(undefined)).not.toThrow()
  })

  it("does nothing when signal is not aborted", () => {
    const ac = new AbortController()
    expect(() => throwIfAborted(ac.signal)).not.toThrow()
  })

  it("throws SyncAbortedError when aborted without reason", () => {
    const ac = new AbortController()
    ac.abort()
    expect(() => throwIfAborted(ac.signal)).toThrow(SyncAbortedError)
  })

  it("rethrows Error reason when aborted with Error", () => {
    const ac = new AbortController()
    ac.abort(new Error("sync timeout"))
    expect(() => throwIfAborted(ac.signal)).toThrow(SyncAbortedError)
    expect(() => throwIfAborted(ac.signal)).toThrow("timeout")
  })

  it("uses string reason as message", () => {
    const ac = new AbortController()
    ac.abort("timeout")
    expect(() => throwIfAborted(ac.signal)).toThrow("timeout")
  })
})

describe("isSyncAbortError / isSyncTimeoutError", () => {
  it("detects SyncAbortedError", () => {
    expect(isSyncAbortError(new SyncAbortedError())).toBe(true)
  })

  it("detects timeout via signal reason", () => {
    const ac = new AbortController()
    ac.abort("timeout")
    expect(isSyncTimeoutError(new SyncAbortedError("timeout"), ac.signal)).toBe(
      true,
    )
  })

  it("detects timeout via error message", () => {
    expect(isSyncTimeoutError(new Error("sync timeout"))).toBe(true)
    expect(isSyncTimeoutError(new SyncAbortedError("timeout"))).toBe(true)
  })
})
