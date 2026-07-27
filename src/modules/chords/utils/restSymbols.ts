export type RestGlyphKind =
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "sixteenth"

export type RestGlyph = {
  kind: RestGlyphKind
  dotted: boolean
  /** Beat cost of this glyph under the given note value. */
  beats: number
  label: string
}

const KIND_DENOM: Record<RestGlyphKind, number> = {
  whole: 1,
  half: 2,
  quarter: 4,
  eighth: 8,
  sixteenth: 16,
}

const KIND_LABEL: Record<RestGlyphKind, string> = {
  whole: "Whole rest",
  half: "Half rest",
  quarter: "Quarter rest",
  eighth: "Eighth rest",
  sixteenth: "Sixteenth rest",
}

function normalizeNoteValue(noteValue: number): 2 | 4 | 8 {
  if (noteValue === 2 || noteValue === 8) return noteValue
  return 4
}

/** Undotted rest duration in chart beats (1 beat = noteValue unit). */
export function undottedRestBeats(
  kind: RestGlyphKind,
  noteValue: number,
): number {
  return normalizeNoteValue(noteValue) / KIND_DENOM[kind]
}

type Candidate = {
  kind: RestGlyphKind
  dotted: boolean
  beats: number
}

function candidatesForNoteValue(noteValue: number): Candidate[] {
  const nv = normalizeNoteValue(noteValue)
  const kinds = Object.keys(KIND_DENOM) as RestGlyphKind[]
  const out: Candidate[] = []

  for (const kind of kinds) {
    const base = undottedRestBeats(kind, nv)
    if (base >= 1 && Number.isInteger(base)) {
      out.push({ kind, dotted: false, beats: base })
      const dottedBeats = base * 1.5
      if (Number.isInteger(dottedBeats)) {
        out.push({ kind, dotted: true, beats: dottedBeats })
      }
    }
  }

  return out.sort((a, b) => b.beats - a.beats)
}

function glyphLabel(kind: RestGlyphKind, dotted: boolean): string {
  const base = KIND_LABEL[kind]
  return dotted ? `Dotted ${base.toLowerCase()}` : base
}

/**
 * Map a rest block duration to one or more standard rest glyphs.
 * Full-measure rests always use the whole-rest convention.
 * Prefer dotted values (e.g. 3 → dotted half in 4/4) over stacked quarters.
 */
export function restGlyphsForDuration(
  duration: number,
  beatsPerMeasure: number,
  noteValue: number = 4,
): RestGlyph[] {
  const beats = Math.max(1, Math.floor(duration))
  const measure = Math.max(1, Math.floor(beatsPerMeasure))
  const nv = normalizeNoteValue(noteValue)

  if (beats >= measure) {
    return [
      {
        kind: "whole",
        dotted: false,
        beats: measure,
        label: "Whole rest (full measure)",
      },
    ]
  }

  const pool = candidatesForNoteValue(nv)
  const glyphs: RestGlyph[] = []
  let left = beats

  while (left > 0) {
    const pick = pool.find((c) => c.beats <= left)
    if (!pick) {
      glyphs.push({
        kind: "quarter",
        dotted: false,
        beats: 1,
        label: KIND_LABEL.quarter,
      })
      left -= 1
      continue
    }
    glyphs.push({
      kind: pick.kind,
      dotted: pick.dotted,
      beats: pick.beats,
      label: glyphLabel(pick.kind, pick.dotted),
    })
    left -= pick.beats
  }

  return glyphs
}
