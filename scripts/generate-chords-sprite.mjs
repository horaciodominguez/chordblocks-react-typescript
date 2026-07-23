/**
 * Generates public/assets/chords-sprite.svg from chordFingerings.mjs
 * Compact output: no HTML comments, minimal whitespace.
 */
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  buildAllFingerings,
  FLAT_ALIASES,
  SUFFIXES,
} from "./chordFingerings.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "../public/assets/chords-sprite.svg")

const STRING_X = [40, 76, 112, 148, 184, 220] // string 6→1
const FRET_CY = { 1: 70, 2: 110, 3: 150, 4: 190 }

function stringIndex(stringNum) {
  // stringNum: 6 (low E) … 1 (high e) → 0…5
  return 6 - stringNum
}

function muteMark(x) {
  return `<line x1="${x - 8}" y1="5" x2="${x + 8}" y2="25"/><line x1="${x + 8}" y1="5" x2="${x - 8}" y2="25"/>`
}

function openMark(x) {
  return `<circle cx="${x}" cy="15" r="10"/>`
}

function fingerCircle(stringIdx, relativeFret) {
  const cx = STRING_X[stringIdx]
  const cy = FRET_CY[relativeFret]
  if (cy == null) return ""
  return `<circle cx="${cx}" cy="${cy}" r="11" fill="currentColor"/>`
}

function barreRect(barre, baseFret) {
  const rel = barre.fret - baseFret + 1
  const cy = FRET_CY[rel]
  if (cy == null) return ""
  const fromIdx = stringIndex(barre.fromString)
  const toIdx = stringIndex(barre.toString)
  const left = Math.min(fromIdx, toIdx)
  const right = Math.max(fromIdx, toIdx)
  const x = STRING_X[left] - 12
  const width = STRING_X[right] - STRING_X[left] + 24
  const y = cy - 6
  return `<rect x="${x}" y="${y}" width="${width}" height="12" rx="6" ry="6" fill="currentColor"/>`
}

/**
 * @param {string} id
 * @param {{ frets: (number|null)[], baseFret: number, barre?: { fret: number, fromString: number, toString: number } }} shape
 */
function renderSymbol(id, shape) {
  const { frets, baseFret, barre } = shape
  const grid = baseFret === 1 ? "main-grid-with-nut" : "main-grid-no-nut"
  const parts = [
    `<symbol id="${id}" viewBox="0 0 260 260" preserveAspectRatio="xMinYMin meet">`,
  ]
  parts.push(`<use href="#${grid}"/>`)

  if (baseFret > 1) {
    parts.push(
      `<text x="0" y="84" font-size="42" fill="currentColor">${baseFret}</text>`,
    )
  }

  if (barre) {
    const rect = barreRect(barre, baseFret)
    if (rect) parts.push(rect)
  }

  const barreStrings = new Set()
  if (barre) {
    const a = Math.min(barre.fromString, barre.toString)
    const b = Math.max(barre.fromString, barre.toString)
    for (let s = a; s <= b; s++) barreStrings.add(s)
  }

  for (let i = 0; i < 6; i++) {
    const f = frets[i]
    if (f == null || f === 0) continue
    const stringNum = 6 - i
    // Skip dots covered by barre at the same fret
    if (barre && barreStrings.has(stringNum) && f === barre.fret) continue
    const rel = baseFret === 1 ? f : f - baseFret + 1
    if (rel < 1 || rel > 4) {
      // Clamp visually if data is slightly off
      const clamped = Math.max(1, Math.min(4, rel))
      parts.push(fingerCircle(i, clamped))
    } else {
      parts.push(fingerCircle(i, rel))
    }
  }

  const xo = []
  for (let i = 0; i < 6; i++) {
    const f = frets[i]
    const x = STRING_X[i]
    if (f == null) xo.push(muteMark(x))
    else if (f === 0) xo.push(openMark(x))
  }
  if (xo.length) {
    parts.push(
      `<g stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none">${xo.join("")}</g>`,
    )
  }

  parts.push(`</symbol>`)
  return parts.join("")
}

function grids() {
  return [
    `<symbol id="main-grid-with-nut" viewBox="0 0 260 260" preserveAspectRatio="xMinYMin meet">`,
    `<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">`,
    `<line x1="40" y1="50" x2="40" y2="240"/><line x1="76" y1="50" x2="76" y2="240"/><line x1="112" y1="50" x2="112" y2="240"/>`,
    `<line x1="148" y1="50" x2="148" y2="240"/><line x1="184" y1="50" x2="184" y2="240"/><line x1="220" y1="50" x2="220" y2="240"/>`,
    `<line x1="40" y1="90" x2="220" y2="90"/><line x1="40" y1="130" x2="220" y2="130"/><line x1="40" y1="170" x2="220" y2="170"/><line x1="40" y1="210" x2="220" y2="210"/>`,
    `</g>`,
    `<line x1="36" y1="40" x2="224" y2="40" stroke="currentColor" stroke-width="10"/>`,
    `</symbol>`,
    `<symbol id="main-grid-no-nut" viewBox="0 0 260 260" preserveAspectRatio="xMinYMin meet">`,
    `<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">`,
    `<line x1="40" y1="50" x2="40" y2="240"/><line x1="76" y1="50" x2="76" y2="240"/><line x1="112" y1="50" x2="112" y2="240"/>`,
    `<line x1="148" y1="50" x2="148" y2="240"/><line x1="184" y1="50" x2="184" y2="240"/><line x1="220" y1="50" x2="220" y2="240"/>`,
    `<line x1="40" y1="50" x2="220" y2="50"/><line x1="40" y1="90" x2="220" y2="90"/><line x1="40" y1="130" x2="220" y2="130"/><line x1="40" y1="170" x2="220" y2="170"/><line x1="40" y1="210" x2="220" y2="210"/>`,
    `</g>`,
    `</symbol>`,
  ].join("")
}

function main() {
  const fingerings = buildAllFingerings()
  const ids = Object.keys(fingerings).sort((a, b) => a.localeCompare(b, "en"))

  const body = [grids()]
  for (const id of ids) {
    body.push(renderSymbol(id, fingerings[id]))
  }

  for (const [flat, sharp] of Object.entries(FLAT_ALIASES)) {
    for (const suffix of SUFFIXES) {
      body.push(
        `<symbol id="${flat}${suffix}"><use href="#${sharp}${suffix}"/></symbol>`,
      )
    }
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" xmlns:xlink="http://www.w3.org/1999/xlink">`,
    ...body,
    `</svg>`,
    ``,
  ].join("\n")

  if (svg.includes("<!--")) {
    throw new Error("Generated SVG must not contain HTML comments")
  }

  writeFileSync(OUT, svg, "utf8")
  const aliasCount = Object.keys(FLAT_ALIASES).length * SUFFIXES.length
  console.log(
    `Wrote ${OUT} (${ids.length} diagrams + ${aliasCount} aliases, ${Buffer.byteLength(svg)} bytes)`,
  )
}

main()
