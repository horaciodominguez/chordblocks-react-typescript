import { describe, expect, it } from "vitest"
import { sectionBarsColClass } from "@/modules/songs/components/ui/SectionBars"

describe("sectionBarsColClass (guide)", () => {
  it("uses a single column when bars are dense (4+ blocks)", () => {
    expect(sectionBarsColClass(2, "guide", 4)).toBe("grid-cols-1")
  })

  it("keeps 3-block bars to at most 2 columns", () => {
    expect(sectionBarsColClass(3, "guide", 3)).toBe(
      "grid-cols-1 sm:grid-cols-2",
    )
  })

  it("does not pack 3-block guide bars into 4 columns (regression)", () => {
    const cls = sectionBarsColClass(3, "guide", 3)
    expect(cls).not.toContain("md:grid-cols-4")
    expect(cls).not.toContain("sm:grid-cols-3")
  })
})

describe("sectionBarsColClass (bars density)", () => {
  it("keeps previous responsive packing for edit/view bars mode", () => {
    expect(sectionBarsColClass(3, "bars", 3)).toBe(
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    )
  })
})
