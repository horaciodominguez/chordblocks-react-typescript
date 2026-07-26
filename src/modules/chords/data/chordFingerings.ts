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

const SLASH_SPRITE_ID_SET = new Set<string>(SLASH_SPRITE_IDS)

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
  return ids
}

/** True when a curated slash sprite exists for this chart name. */
export function hasCuratedSlashFingering(chordName: string): boolean {
  if (!chordName.includes("/")) return false
  return SLASH_SPRITE_ID_SET.has(resolveDiagramSpriteId(chordName))
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
  const lookup =
    FLAT_ALIASES[pitch as keyof typeof FLAT_ALIASES] ?? pitch
  const out: { suffix: string; type: "slash"; name: string }[] = []
  for (const id of SLASH_SPRITE_IDS) {
    const sep = id.lastIndexOf("_")
    const top = id.slice(0, sep)
    const bass = id.slice(sep + 1)
    const { root, suffix: quality } = splitRootSuffix(top)
    if (root !== lookup) continue
    const suffix = `${quality}/${bass}`
    const displayTop =
      pitch === lookup ? top : `${pitch}${quality}`
    out.push({
      suffix,
      type: "slash",
      name: `${displayTop}/${bass}`,
    })
  }
  return out
}

/**
 * Resolve chord name to sprite symbol id.
 * Known slash → underscore id; unknown slash → top chord (no invention).
 */
export function resolveDiagramSpriteId(chordName: string): string {
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
