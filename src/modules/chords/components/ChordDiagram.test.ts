import { describe, expect, it } from "vitest"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  resolveDiagramSpriteId,
  voicingCount,
} from "@/modules/chords/data/chordFingerings"

describe("ChordDiagram", () => {
  it("uses curated slash sprite id when present", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "F/C" }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#F_C"')
    expect(html).not.toContain("#F/C")
    expect(html).not.toContain('href="/assets/chords-sprite.svg#F"')
  })

  it("falls back to top chord when slash shape is not curated", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "Cm/A#" }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#Cm"')
    expect(html).not.toContain("#Cm_A#")
  })

  it("keeps plain chord names", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "Am7" }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#Am7"')
  })

  it("uses alternate voicing sprite when requested", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "C", voicing: 1 }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#C__v2"')
  })

  it("falls back to primary when voicing alt is missing", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "Am7", voicing: 2 }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#Am7"')
  })
})

describe("resolveDiagramSpriteId", () => {
  it("encodes curated slash chords", () => {
    expect(resolveDiagramSpriteId("C/E")).toBe("C_E")
    expect(resolveDiagramSpriteId("D/F#")).toBe("D_F#")
    expect(resolveDiagramSpriteId("Am/G")).toBe("Am_G")
  })

  it("does not invent unknown slash shapes", () => {
    expect(resolveDiagramSpriteId("Cm/A#")).toBe("Cm")
    expect(resolveDiagramSpriteId("F#m/C#")).toBe("F#m")
  })

  it("maps voicing index to __vN without inventing", () => {
    expect(resolveDiagramSpriteId("C", 0)).toBe("C")
    expect(resolveDiagramSpriteId("C", 1)).toBe("C__v2")
    expect(resolveDiagramSpriteId("C", 2)).toBe("C__v3")
    expect(voicingCount("C")).toBe(3)
    expect(voicingCount("G")).toBe(2)
    expect(voicingCount("Am7")).toBe(1)
    expect(resolveDiagramSpriteId("G", 9)).toBe("G__v2")
  })
})
