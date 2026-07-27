/** Curated feel / dynamics markers for band rehearsal charts. */
export const FEEL_MARKER_IDS = [
  "stop",
  "half-time",
  "rit",
  "break",
  "build",
] as const

export type FeelMarkerId = (typeof FEEL_MARKER_IDS)[number]

const FEEL_LABELS: Record<FeelMarkerId, string> = {
  stop: "Stop",
  "half-time": "½ time",
  rit: "Rit.",
  break: "Break",
  build: "Build",
}

export function isFeelMarkerId(value: string): value is FeelMarkerId {
  return (FEEL_MARKER_IDS as readonly string[]).includes(value)
}

export function feelMarkerLabel(id: FeelMarkerId): string {
  return FEEL_LABELS[id]
}

export const FEEL_TOKEN_PREFIX = "__FEEL:"

export function feelToken(id: FeelMarkerId): string {
  return `${FEEL_TOKEN_PREFIX}${id}__`
}

export function parseFeelToken(token: string): FeelMarkerId | undefined {
  if (!token.startsWith(FEEL_TOKEN_PREFIX) || !token.endsWith("__")) {
    return undefined
  }
  const inner = token.slice(FEEL_TOKEN_PREFIX.length, -2)
  return isFeelMarkerId(inner) ? inner : undefined
}

export function isFeelToken(token: string): boolean {
  return parseFeelToken(token) != null
}
