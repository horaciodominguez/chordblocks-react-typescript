import { describe, expect, it } from "vitest"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

describe("ChordDiagram", () => {
  it("strips slash bass for sprite id", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "F/C" }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#F"')
    expect(html).not.toContain("#F/C")
  })

  it("keeps plain chord names", () => {
    const html = renderToStaticMarkup(
      createElement(ChordDiagram, { chordName: "Am7" }),
    )
    expect(html).toContain('href="/assets/chords-sprite.svg#Am7"')
  })
})
