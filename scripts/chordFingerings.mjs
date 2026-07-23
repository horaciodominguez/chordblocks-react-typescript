/**
 * Canonical guitar chord fingerings (1 voicing per name).
 * frets: string 6→1; null = mute (X), 0 = open (O), n = absolute fret
 * baseFret: 1 = nut grid; >1 = no-nut + fret number label
 * barre?: { fret, fromString, toString } — absolute fret; strings 6=1 … 1=6
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
]

export const SUFFIXES = [
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
]

export const FLAT_ALIASES = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
}

/** @typedef {{ frets: (number|null)[], baseFret: number, barre?: { fret: number, fromString: number, toString: number } }} Shape */

/**
 * Shift a barre/open shape so the root lands on `targetRoot`.
 * `rootIndex` = chromatic index of the shape's root; frets are absolute.
 * @param {Shape} shape
 * @param {number} rootIndex
 * @param {number} targetIndex
 * @returns {Shape}
 */
function transposeShape(shape, rootIndex, targetIndex) {
  const semitones = (targetIndex - rootIndex + 12) % 12
  if (semitones === 0) {
    return {
      frets: [...shape.frets],
      baseFret: shape.baseFret,
      ...(shape.barre ? { barre: { ...shape.barre } } : {}),
    }
  }

  const frets = shape.frets.map((f) =>
    f == null || f === 0 ? f : f + semitones,
  )
  let baseFret =
    shape.baseFret === 1 && frets.every((f) => f == null || f === 0 || f <= 4)
      ? 1
      : Math.min(...frets.filter((f) => typeof f === "number" && f > 0))

  // Prefer showing a 4-fret window starting at the lowest fretted note
  // (or barre fret). Cap base so relative frets stay in 1..4.
  const pressed = frets.filter((f) => typeof f === "number" && f > 0)
  if (pressed.length === 0) {
    return { frets, baseFret: 1 }
  }
  const minFret = Math.min(...pressed)
  const maxFret = Math.max(...pressed)
  baseFret = minFret
  if (maxFret - baseFret + 1 > 4) {
    baseFret = maxFret - 3
  }
  if (baseFret < 1) baseFret = 1

  // If everything fits in frets 1–4 with opens, use nut
  if (maxFret <= 4 && frets.some((f) => f === 0)) {
    baseFret = 1
  }

  /** @type {Shape} */
  const out = { frets, baseFret }
  if (shape.barre) {
    out.barre = {
      fret: shape.barre.fret + semitones,
      fromString: shape.barre.fromString,
      toString: shape.barre.toString,
    }
  }
  return out
}

/** E-shape barre templates at fret 1 (F root on string 6). Strings 6→1. */
const E_BARRE = {
  "": {
    frets: [1, 3, 3, 2, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  m: {
    frets: [1, 3, 3, 1, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  5: {
    frets: [1, 3, 3, null, null, null],
    baseFret: 1,
    barre: { fret: 3, fromString: 5, toString: 4 },
  },
  6: {
    frets: [1, null, 3, 2, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  m6: {
    frets: [1, null, 3, 1, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  7: {
    frets: [1, 3, 1, 2, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  m7: {
    frets: [1, 3, 1, 1, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  maj7: {
    frets: [1, 3, 2, 2, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  dim: { frets: [1, 2, 3, 1, null, null], baseFret: 1 },
  dim7: {
    frets: [1, 2, 3, 1, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  aug: {
    frets: [1, null, 3, 2, 2, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  m7b5: { frets: [1, null, 1, 1, 2, null], baseFret: 1 },
  9: {
    frets: [1, 3, 1, 2, 1, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 2 },
  },
  m9: {
    frets: [1, 3, 1, 1, 1, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 2 },
  },
  maj9: {
    frets: [1, null, 2, 2, 1, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  add9: {
    frets: [1, 3, 3, 2, 1, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 2 },
  },
  sus2: {
    frets: [1, 3, 3, null, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  sus4: {
    frets: [1, 3, 3, 3, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
  "7sus4": {
    frets: [1, 3, 1, 3, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 1 },
  },
}

/** A-shape barre templates at fret 1 (A#/Bb root on string 5). */
const A_BARRE = {
  "": {
    frets: [null, 1, 3, 3, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  m: {
    frets: [null, 1, 3, 3, 2, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  5: {
    frets: [null, 1, 3, 3, null, null],
    baseFret: 1,
    barre: { fret: 3, fromString: 4, toString: 3 },
  },
  6: {
    frets: [null, 1, 3, 3, 3, 3],
    baseFret: 1,
    barre: { fret: 3, fromString: 4, toString: 1 },
  },
  m6: { frets: [null, 1, 3, 3, 2, 3], baseFret: 1 },
  7: {
    frets: [null, 1, 3, 1, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  m7: {
    frets: [null, 1, 3, 1, 2, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  maj7: {
    frets: [null, 1, 3, 2, 3, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  dim: { frets: [null, 1, 2, 3, 2, null], baseFret: 1 },
  dim7: { frets: [null, 1, 2, 3, 2, 3], baseFret: 1 },
  aug: { frets: [null, 1, 4, 3, 3, 2], baseFret: 1 },
  m7b5: { frets: [null, 1, 2, 1, 2, null], baseFret: 1 },
  9: {
    frets: [null, 1, 3, 1, 3, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  m9: {
    frets: [null, 1, 3, 1, 2, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  maj9: {
    frets: [null, 1, 3, 2, 3, 3],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  add9: {
    frets: [null, 1, 3, 3, 3, 3],
    baseFret: 1,
    barre: { fret: 3, fromString: 4, toString: 1 },
  },
  sus2: {
    frets: [null, 1, 3, 3, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  sus4: {
    frets: [null, 1, 3, 3, 4, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
  "7sus4": {
    frets: [null, 1, 3, 1, 4, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 5, toString: 1 },
  },
}

/** Open / preferred shapes keyed by `${root}${suffix}`. */
const OPEN_SHAPES = {
  // Major
  C: { frets: [null, 3, 2, 0, 1, 0], baseFret: 1 },
  D: { frets: [null, null, 0, 2, 3, 2], baseFret: 1 },
  E: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  G: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  A: { frets: [null, 0, 2, 2, 2, 0], baseFret: 1 },

  // Minor
  Dm: { frets: [null, null, 0, 2, 3, 1], baseFret: 1 },
  Em: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  Am: { frets: [null, 0, 2, 2, 1, 0], baseFret: 1 },

  // 7
  C7: { frets: [null, 3, 2, 3, 1, 0], baseFret: 1 },
  D7: { frets: [null, null, 0, 2, 1, 2], baseFret: 1 },
  E7: { frets: [0, 2, 0, 1, 0, 0], baseFret: 1 },
  G7: { frets: [3, 2, 0, 0, 0, 1], baseFret: 1 },
  A7: { frets: [null, 0, 2, 0, 2, 0], baseFret: 1 },
  B7: { frets: [null, 2, 1, 2, 0, 2], baseFret: 1 },

  // m7
  Dm7: { frets: [null, null, 0, 2, 1, 1], baseFret: 1 },
  Em7: { frets: [0, 2, 0, 0, 0, 0], baseFret: 1 },
  Am7: { frets: [null, 0, 2, 0, 1, 0], baseFret: 1 },

  // maj7
  Cmaj7: { frets: [null, 3, 2, 0, 0, 0], baseFret: 1 },
  Dmaj7: { frets: [null, null, 0, 2, 2, 2], baseFret: 1 },
  Emaj7: { frets: [0, 2, 1, 1, 0, 0], baseFret: 1 },
  Fmaj7: {
    frets: [1, 3, 2, 2, 1, 0],
    baseFret: 1,
    barre: { fret: 1, fromString: 6, toString: 2 },
  },
  Gmaj7: { frets: [3, 2, 0, 0, 0, 2], baseFret: 1 },
  Amaj7: { frets: [null, 0, 2, 1, 2, 0], baseFret: 1 },

  // 9
  C9: { frets: [null, 3, 2, 3, 3, 3], baseFret: 1 },
  D9: { frets: [null, null, 0, 2, 1, 0], baseFret: 1 },
  E9: { frets: [0, 2, 0, 1, 0, 2], baseFret: 1 },
  A9: { frets: [null, 0, 2, 4, 2, 3], baseFret: 1 },
  G9: { frets: [3, null, 0, 2, 0, 1], baseFret: 1 },

  // sus
  Csus2: { frets: [null, 3, 0, 0, 1, 3], baseFret: 1 },
  Csus4: {
    frets: [null, 3, 3, 0, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 2, toString: 1 },
  },
  Dsus2: { frets: [null, null, 0, 2, 3, 0], baseFret: 1 },
  Dsus4: { frets: [null, null, 0, 2, 3, 3], baseFret: 1 },
  Esus2: { frets: [0, 2, 2, null, 0, 0], baseFret: 1 },
  Esus4: { frets: [0, 2, 2, 2, 0, 0], baseFret: 1 },
  Asus2: { frets: [null, 0, 2, 2, 0, 0], baseFret: 1 },
  Asus4: { frets: [null, 0, 2, 2, 3, 0], baseFret: 1 },
  Gsus2: { frets: [3, null, 0, 0, 3, 3], baseFret: 1 },
  Gsus4: { frets: [3, null, 0, 0, 1, 3], baseFret: 1 },

  // 5 (power)
  A5: { frets: [null, 0, 2, 2, null, null], baseFret: 1 },
  E5: { frets: [0, 2, 2, null, null, null], baseFret: 1 },
  D5: { frets: [null, null, 0, 2, 3, null], baseFret: 1 },
  G5: {
    frets: [3, 5, 5, null, null, null],
    baseFret: 3,
    barre: { fret: 5, fromString: 5, toString: 4 },
  },

  // 6
  C6: { frets: [null, 3, 2, 2, 1, 0], baseFret: 1 },
  D6: { frets: [null, null, 0, 2, 0, 2], baseFret: 1 },
  E6: { frets: [0, 2, 2, 1, 2, 0], baseFret: 1 },
  A6: { frets: [null, 0, 2, 2, 2, 2], baseFret: 1 },
  G6: { frets: [3, 2, 0, 0, 0, 0], baseFret: 1 },

  // m6
  Am6: { frets: [null, 0, 2, 2, 1, 2], baseFret: 1 },
  Dm6: { frets: [null, null, 0, 2, 0, 1], baseFret: 1 },
  Em6: { frets: [0, 2, 2, 0, 2, 0], baseFret: 1 },

  // dim / dim7 / aug / m7b5
  Cdim: { frets: [null, 3, 4, 5, 4, null], baseFret: 3 },
  Ddim: { frets: [null, null, 0, 1, 3, 1], baseFret: 1 },
  Edim: { frets: [null, null, 2, 3, 5, 3], baseFret: 2 },
  Adim: { frets: [null, 0, 1, 2, 1, null], baseFret: 1 },
  Bdim: { frets: [null, 2, 3, 4, 3, null], baseFret: 2 },

  Cdim7: { frets: [null, 3, 4, 2, 4, 2], baseFret: 2 },
  Ddim7: { frets: [null, null, 0, 1, 0, 1], baseFret: 1 },
  Edim7: { frets: [null, null, 2, 3, 2, 3], baseFret: 2 },
  Adim7: { frets: [null, 0, 1, 2, 1, 2], baseFret: 1 },
  Bdim7: { frets: [null, 2, 3, 1, 3, 1], baseFret: 1 },

  Caug: { frets: [null, 3, 2, 1, 1, 0], baseFret: 1 },
  Daug: { frets: [null, null, 0, 3, 3, 2], baseFret: 1 },
  Eaug: { frets: [0, 3, 2, 1, 1, 0], baseFret: 1 },
  Aaug: { frets: [null, 0, 3, 2, 2, 1], baseFret: 1 },
  Gaug: { frets: [3, 2, 1, 0, 0, 3], baseFret: 1 },

  Cm7b5: { frets: [null, 3, 4, 3, 4, null], baseFret: 3 },
  Dm7b5: { frets: [null, null, 0, 1, 1, 1], baseFret: 1 },
  Em7b5: { frets: [null, null, 2, 3, 3, 3], baseFret: 2 },
  Am7b5: { frets: [null, 0, 1, 0, 1, null], baseFret: 1 },
  Bm7b5: { frets: [null, 2, 3, 2, 3, null], baseFret: 2 },

  // add9
  Cadd9: { frets: [null, 3, 2, 0, 3, 0], baseFret: 1 },
  Dadd9: { frets: [null, null, 0, 2, 3, 0], baseFret: 1 },
  Eadd9: { frets: [0, 2, 2, 1, 0, 2], baseFret: 1 },
  Gadd9: { frets: [3, 2, 0, 0, 0, 0], baseFret: 1 },
  Aadd9: { frets: [null, 0, 2, 4, 2, 0], baseFret: 1 },

  // 7sus4
  C7sus4: {
    frets: [null, 3, 3, 3, 1, 1],
    baseFret: 1,
    barre: { fret: 1, fromString: 2, toString: 1 },
  },
  D7sus4: { frets: [null, null, 0, 2, 1, 3], baseFret: 1 },
  E7sus4: { frets: [0, 2, 0, 2, 0, 0], baseFret: 1 },
  A7sus4: { frets: [null, 0, 2, 0, 3, 0], baseFret: 1 },
  G7sus4: { frets: [3, 3, 0, 0, 1, 1], baseFret: 1 },

  // m9 / maj9 (common open-ish)
  Am9: { frets: [null, 0, 2, 4, 1, 3], baseFret: 1 },
  Em9: { frets: [0, 2, 0, 0, 0, 2], baseFret: 1 },
  Dm9: { frets: [null, null, 0, 2, 1, 0], baseFret: 1 },
  Cmaj9: { frets: [null, 3, 2, 4, 0, 0], baseFret: 1 },
  Dmaj9: { frets: [null, null, 0, 2, 2, 0], baseFret: 1 },
  Gmaj9: { frets: [3, null, 0, 2, 0, 2], baseFret: 1 },
  Amaj9: { frets: [null, 0, 2, 1, 0, 0], baseFret: 1 },
  Emaj9: { frets: [0, 2, 1, 1, 0, 2], baseFret: 1 },
}

/**
 * Prefer A-shape for roots that sit well on string 5 (C, C#, D, D#, A, A#, B…),
 * E-shape for F–G# family. Open shapes override when listed.
 */
function preferAShape(rootIndex) {
  // A=9 → A_BARRE at 1 is A# (index 10). E_BARRE at 1 is F (index 5).
  // Use A-shape for C, C#, D, D#, A, A#, B (indices 0,1,2,3,9,10,11)
  return [0, 1, 2, 3, 9, 10, 11].includes(rootIndex)
}

/**
 * Build all 228 chord shapes.
 * @returns {Record<string, Shape>}
 */
export function buildAllFingerings() {
  /** @type {Record<string, Shape>} */
  const out = {}

  for (let ri = 0; ri < CHROMATIC_ROOTS.length; ri++) {
    const root = CHROMATIC_ROOTS[ri]
    for (const suffix of SUFFIXES) {
      const id = `${root}${suffix}`
      if (OPEN_SHAPES[id]) {
        out[id] = cloneShape(OPEN_SHAPES[id])
        continue
      }

      if (preferAShape(ri) && A_BARRE[suffix]) {
        // A_BARRE templates are at fret 1 = A# (Bb), root index 10
        out[id] = transposeShape(A_BARRE[suffix], 10, ri)
      } else if (E_BARRE[suffix]) {
        // E_BARRE at fret 1 = F, root index 5
        out[id] = transposeShape(E_BARRE[suffix], 5, ri)
      } else {
        throw new Error(`No fingering for ${id}`)
      }

      // Normalize baseFret window after transpose
      out[id] = normalizeBaseFret(out[id])
    }
  }

  return out
}

/** @param {Shape} s */
function cloneShape(s) {
  return {
    frets: [...s.frets],
    baseFret: s.baseFret,
    ...(s.barre ? { barre: { ...s.barre } } : {}),
  }
}

/** @param {Shape} shape */
function normalizeBaseFret(shape) {
  const frets = shape.frets
  const pressed = frets.filter((f) => typeof f === "number" && f > 0)
  if (pressed.length === 0) return { ...shape, baseFret: 1 }

  const hasOpen = frets.some((f) => f === 0)
  const minFret = Math.min(...pressed)
  const maxFret = Math.max(...pressed)

  if (hasOpen && maxFret <= 4) {
    return {
      ...shape,
      frets: [...frets],
      baseFret: 1,
      ...(shape.barre ? { barre: { ...shape.barre } } : {}),
    }
  }

  let baseFret = minFret
  if (maxFret - baseFret > 3) baseFret = maxFret - 3
  if (baseFret < 1) baseFret = 1

  return {
    frets: [...frets],
    baseFret,
    ...(shape.barre ? { barre: { ...shape.barre } } : {}),
  }
}
