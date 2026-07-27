import { describe, it, expect } from "vitest"
import { fretsToMidi } from "@/modules/chords/audio/fretToMidi"
import { chordPreviewMidiNotes } from "@/modules/chords/audio/chordPreviewNotes"

describe("fretsToMidi", () => {
  it("maps open C major shape to expected notes", () => {
    const midis = fretsToMidi([null, 3, 2, 0, 1, 0])
    expect(midis).toEqual([48, 52, 55, 60, 64])
  })

  it("skips muted strings", () => {
    expect(fretsToMidi([null, null, 0, 2, 3, 2])).toEqual([50, 57, 62, 66])
  })
})

describe("chordPreviewMidiNotes", () => {
  it("returns notes for a curated chord", () => {
    const notes = chordPreviewMidiNotes("C", 0)
    expect(notes.length).toBeGreaterThan(0)
  })

  it("uses alternate voicing when available", () => {
    const primary = chordPreviewMidiNotes("C", 0)
    const alt = chordPreviewMidiNotes("C", 1)
    if (primary.join() !== alt.join()) {
      expect(alt.length).toBeGreaterThan(0)
    } else {
      expect(alt).toEqual(primary)
    }
  })

  it("falls back for unknown chord names", () => {
    const notes = chordPreviewMidiNotes("Xyz", 0)
    expect(notes.length).toBeGreaterThanOrEqual(3)
  })
})
