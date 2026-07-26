import { describe, expect, it } from "vitest"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { resolveDiagramSpriteId } from "@/modules/chords/data/chordFingerings"

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
})
