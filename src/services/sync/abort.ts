export class SyncAbortedError extends Error {
  readonly name = "SyncAbortedError"

  constructor(message = "Sync aborted") {
    super(message)
  }
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return

  const reason = signal.reason
  if (reason instanceof SyncAbortedError) {
    throw reason
  }
  if (reason === "timeout") {
    throw new SyncAbortedError("timeout")
  }
  if (typeof reason === "string") {
    throw new SyncAbortedError(reason)
  }
  if (reason instanceof Error && reason.message === "sync timeout") {
    throw new SyncAbortedError("timeout")
  }
  throw new SyncAbortedError(
    reason instanceof Error ? reason.message : "Sync aborted",
  )
}

export function isSyncAbortError(err: unknown): boolean {
  if (err instanceof SyncAbortedError) return true
  if (err instanceof DOMException && err.name === "AbortError") return true
  if (err instanceof Error) {
    return (
      err.name === "AbortError" ||
      err.name === "SyncAbortedError" ||
      err.message === "sync timeout"
    )
  }
  return false
}

export function isSyncTimeoutError(
  err: unknown,
  signal?: AbortSignal,
): boolean {
  if (signal?.aborted && signal.reason === "timeout") return true
  if (!(err instanceof Error)) return false
  return err.message === "sync timeout" || err.message === "timeout"
}
