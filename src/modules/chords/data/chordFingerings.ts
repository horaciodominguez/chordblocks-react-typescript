/**
 * Chord fingering catalog metadata (sprite is generated offline).
 * Fingerings live in scripts/chordFingerings.mjs — single source of truth.
 */
export const CHROMATIC_ROOTS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

export const FLAT_ALIASES = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
} as const

/** Must stay in sync with scripts/chordFingerings.mjs SUFFIXES and VARIATIONS in chords.ts */
export const SPRITE_SUFFIXES = [
  "",
  "m",
  "5",
  "6",
  "m6",
  "7",
  "m7",
  "maj7",
  "dim",
  "dim7",
  "aug",
  "m7b5",
  "9",
  "m9",
  "maj9",
  "add9",
  "sus2",
  "sus4",
  "7sus4",
] as const

/**
 * Curated slash sprite ids (`C/E` → `C_E`). Must match SLASH_SHAPES in chordFingerings.mjs.
 */
export const SLASH_SPRITE_IDS = [
  "C_E",
  "C_G",
  "D_F#",
  "D_A",
  "E_G#",
  "E_B",
  "F_A",
  "F_C",
  "G_B",
  "G_D",
  "A_C#",
  "A_E",
  "Am_C",
  "Am_E",
  "Am_G",
  "Dm_F",
  "Dm_A",
  "Em_G",
  "Em_B",
  "D7_F#",
  "C7_E",
  "G7_B",
] as const

/**
 * Alternate voicing sprite ids (`C__v2`). Must match ALT_VOICINGS in chordFingerings.mjs.
 * Primary voicing is always the bare chord id (`C`); these are extras only.
 */
export const ALT_VOICING_SPRITE_IDS = [
  "C__v2",
  "C__v3",
  "D__v2",
  "E__v2",
  "F__v2",
  "G__v2",
  "A__v2",
  "Am__v2",
  "Dm__v2",
  "Em__v2",
] as const

const SLASH_SPRITE_ID_SET = new Set<string>(SLASH_SPRITE_IDS)
const ALT_VOICING_SPRITE_ID_SET = new Set<string>(ALT_VOICING_SPRITE_IDS)

/** Max voicing index+1 per base sprite id (O(1)). Primary-only chords are absent (= 1). */
const VOICING_COUNT_BY_BASE: Map<string, number> = (() => {
  const map = new Map<string, number>()
  for (const id of ALT_VOICING_SPRITE_IDS) {
    const m = id.match(/^(.*)__v(\d+)$/)
    if (!m) continue
    const base = m[1]
    const n = Number(m[2])
    map.set(base, Math.max(map.get(base) ?? 1, n))
  }
  return map
})()

const SHARP_TO_FLAT = Object.fromEntries(
  Object.entries(FLAT_ALIASES).map(([flat, sharp]) => [sharp, flat]),
) as Record<string, string>

/** Encode chart slash name to sprite id (`C/E` → `C_E`). */
export function slashChordToSpriteId(chordName: string): string {
  const slash = chordName.indexOf("/")
  if (slash < 0) return chordName
  return `${chordName.slice(0, slash)}_${chordName.slice(slash + 1)}`
}

export function splitRootSuffix(name: string): { root: string; suffix: string } {
  const m = name.match(/^([A-G][#b]?)(.*)$/)
  return m ? { root: m[1], suffix: m[2] ?? "" } : { root: name, suffix: "" }
}

function toSharpSpelling(token: string): string {
  const { root, suffix } = splitRootSuffix(token)
  const sharp = FLAT_ALIASES[root as keyof typeof FLAT_ALIASES]
  return sharp ? `${sharp}${suffix}` : token
}

export function expectedSlashFlatAliasIds(): string[] {
  const aliases: string[] = []
  for (const id of SLASH_SPRITE_IDS) {
    const sep = id.lastIndexOf("_")
    if (sep < 0) continue
    const top = id.slice(0, sep)
    const bass = id.slice(sep + 1)
    const { root: topRoot, suffix: topSuffix } = splitRootSuffix(top)
    const flatTop = SHARP_TO_FLAT[topRoot]
    const flatBass = SHARP_TO_FLAT[bass]
    if (flatTop) aliases.push(`${flatTop}${topSuffix}_${bass}`)
    if (flatBass) aliases.push(`${top}_${flatBass}`)
    if (flatTop && flatBass) aliases.push(`${flatTop}${topSuffix}_${flatBass}`)
  }
  return aliases
}

export function expectedSpriteChordIds(): string[] {
  const ids: string[] = []
  for (const root of CHROMATIC_ROOTS) {
    for (const suffix of SPRITE_SUFFIXES) {
      ids.push(`${root}${suffix}`)
    }
  }
  for (const flat of Object.keys(FLAT_ALIASES)) {
    for (const suffix of SPRITE_SUFFIXES) {
      ids.push(`${flat}${suffix}`)
    }
  }
  ids.push(...SLASH_SPRITE_IDS)
  ids.push(...expectedSlashFlatAliasIds())
  ids.push(...ALT_VOICING_SPRITE_IDS)
  return ids
}

/** True when a curated slash sprite exists for this chart name. */
export function hasCuratedSlashFingering(chordName: string): boolean {
  if (!chordName.includes("/")) return false
  return SLASH_SPRITE_ID_SET.has(resolveBaseSpriteId(chordName))
}

/**
 * Slash picker tiles for this root pitch (`C`, `C#`, `Db`, `A`, …).
 * Flat spellings look up the sharp catalog entry; suffix stays composable
 * with BlockPicker (`/E` → C/E, `m/C` → Am/C).
 */
export function slashVariationsForPitch(pitch: string): {
  suffix: string
  type: "slash"
  name: string
}[] {
  const lookup = FLAT_ALIASES[pitch as keyof typeof FLAT_ALIASES] ?? pitch
  const out: { suffix: string; type: "slash"; name: string }[] = []
  for (const id of SLASH_SPRITE_IDS) {
    const sep = id.lastIndexOf("_")
    const top = id.slice(0, sep)
    const bass = id.slice(sep + 1)
    const { root, suffix: quality } = splitRootSuffix(top)
    if (root !== lookup) continue
    const suffix = `${quality}/${bass}`
    const displayTop = pitch === lookup ? top : `${pitch}${quality}`
    out.push({
      suffix,
      type: "slash",
      name: `${displayTop}/${bass}`,
    })
  }
  return out
}

/**
 * Base sprite id for a chart name (slash → `_`, unknown slash → top).
 * Does not apply alternate voicing suffixes.
 */
export function resolveBaseSpriteId(chordName: string): string {
  if (!chordName.includes("/")) return chordName

  const encoded = slashChordToSpriteId(chordName)
  if (SLASH_SPRITE_ID_SET.has(encoded)) return encoded

  const slash = chordName.indexOf("/")
  const top = chordName.slice(0, slash)
  const bass = chordName.slice(slash + 1)
  const sharpEncoded = `${toSharpSpelling(top)}_${toSharpSpelling(bass)}`
  if (SLASH_SPRITE_ID_SET.has(sharpEncoded)) return sharpEncoded

  return top
}

/** How many voicings exist for this chart name (1 = primary only). */
export function voicingCount(chordName: string): number {
  const base = resolveBaseSpriteId(chordName)
  return VOICING_COUNT_BY_BASE.get(base) ?? 1
}

/** Clamp a stored voicing index into the available range. */
export function clampVoicingIndex(chordName: string, voicing = 0): number {
  const count = voicingCount(chordName)
  if (!Number.isFinite(voicing) || voicing < 0) return 0
  return Math.min(Math.floor(voicing), count - 1)
}

export function nextVoicingIndex(chordName: string, voicing = 0): number {
  const count = voicingCount(chordName)
  if (count <= 1) return 0
  return (clampVoicingIndex(chordName, voicing) + 1) % count
}

/**
 * Resolve chord name (+ optional voicing index) to sprite symbol id.
 * Missing alt → fall back to primary (no invention).
 * `voicing` 0 → primary (`C`); 1 → `C__v2`; 2 → `C__v3`.
 */
export function resolveDiagramSpriteId(
  chordName: string,
  voicing = 0,
): string {
  const base = resolveBaseSpriteId(chordName)
  const index = clampVoicingIndex(chordName, voicing)
  if (index <= 0) return base
  const alt = `${base}__v${index + 1}`
  return ALT_VOICING_SPRITE_ID_SET.has(alt) ? alt : base
}
