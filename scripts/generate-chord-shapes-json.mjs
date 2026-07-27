/**
 * Runtime JSON of all chord shapes from chordFingerings.mjs (for Web Audio preview).
 */
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { buildAllFingerings } from "./chordFingerings.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(
  __dirname,
  "../src/modules/chords/data/chordShapes.generated.json",
)

const shapes = buildAllFingerings()
writeFileSync(OUT, JSON.stringify(shapes))
console.log(`Wrote ${Object.keys(shapes).length} shapes → ${OUT}`)
