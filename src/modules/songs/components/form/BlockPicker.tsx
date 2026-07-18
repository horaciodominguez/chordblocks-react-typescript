import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import Label from "@/components/ui/Label"
import Chord from "@/modules/chords/components/Chord"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import Rest from "@/modules/chords/components/Rest"
import { chordsData } from "@/modules/chords/data/chords"
import type { Chord as ChordType } from "@/modules/chords/types/chord.types"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"

type Props = {
  onSelect: (chordName: string) => void
  pendingBeats: string
  beatsPerMeasure: number
  selectedValue?: string
  label?: string
}

export function BlockPicker({
  onSelect,
  pendingBeats,
  beatsPerMeasure,
  selectedValue,
  label,
}: Props) {
  const [root, setRoot] = useState("C")
  const ROOTS = Object.keys(chordsData)
  const [accidental, setAccidental] = useState<"" | "#" | "b">("")
  const VARIATIONS = chordsData[root] ?? []

  const DISALLOW_SHARP = ["E", "B"]
  const DISALLOW_FLAT = ["F", "C"]

  const isSharpAllowed = (r: string) => !DISALLOW_SHARP.includes(r)
  const isFlatAllowed = (r: string) => !DISALLOW_FLAT.includes(r)

  const handleSelect = (chordName: string) => {
    onSelect(chordName)
  }

  const selectClass =
    "w-full border text-white text-sm px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-zinc-400/25 min-h-11"

  return (
    <>
      {label && <Label>{label}</Label>}

      <AppDialog
        trigger={
          <Button variant="primary" className="w-full min-h-11">
            {selectedValue ? (
              selectedValue === "__REST__" ? (
                <span className="inline-flex items-center">
                  <Rest
                    duration={Number(pendingBeats) || 1}
                    beatsPerMeasure={beatsPerMeasure || 4}
                  />
                  <span className="sr-only">Rest selected</span>
                </span>
              ) : (
                <span>
                  <Chord chord={selectedValue} asText={false} />
                </span>
              )
            ) : (
              "Choose Block"
            )}
          </Button>
        }
        title="Choose Block"
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 mb-4">
          <div className="flex-1">
            <Label htmlFor="root_chord">Root</Label>
            <select
              id="root_chord"
              name="root_chord"
              value={root}
              onChange={(e) => {
                const newRoot = e.target.value
                setRoot(newRoot)
                if (
                  (accidental === "#" && !isSharpAllowed(newRoot)) ||
                  (accidental === "b" && !isFlatAllowed(newRoot))
                ) {
                  setAccidental("")
                }
              }}
              className={selectClass}
            >
              {ROOTS.map((r) => (
                <option key={r} value={r} className="bg-gray-800 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Label htmlFor="accidental_chord">Accidental</Label>
            <select
              id="accidental_chord"
              value={accidental}
              onChange={(e) => setAccidental(e.target.value as "" | "#" | "b")}
              className={selectClass}
            >
              <option value="" className="bg-gray-800 text-white">
                Natural
              </option>
              <option
                value="#"
                disabled={!isSharpAllowed(root)}
                className="bg-gray-800 text-white disabled:text-gray-500 disabled:opacity-10"
              >
                Sharp (#)
              </option>
              <option
                value="b"
                disabled={!isFlatAllowed(root)}
                className="bg-gray-800 text-white disabled:text-gray-500 disabled:opacity-10"
              >
                Flat (b)
              </option>
            </select>
          </div>
          <div className="flex-1">
            <Label htmlFor="rest">Rest</Label>
            <Dialog.Close asChild>
              <Button
                id="rest"
                variant="primary"
                onClick={() => onSelect("__REST__")}
                className="w-full flex flex-row gap-2 justify-center items-center min-h-11"
              >
                <Rest
                  duration={Number(pendingBeats) || 1}
                  beatsPerMeasure={beatsPerMeasure || 4}
                />
                Add Rest
              </Button>
            </Dialog.Close>
          </div>
        </div>

        <Label htmlFor="variants">Variants</Label>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          id="variants"
        >
          {VARIATIONS.map((v: ChordType) => (
            <Dialog.Close asChild key={v.name}>
              <button
                id={v.name}
                type="button"
                onClick={() => {
                  handleSelect(`${v.root}${accidental}${v.suffix}`)
                }}
                className="flex flex-col items-center rounded-lg border border-gray-800 bg-zinc-900/10 p-3 hover:bg-indigo-600/10 hover:text-white min-h-11"
              >
                <Chord chord={`${v.root}${accidental}${v.suffix}`} />
                <ChordDiagram chordName={`${v.root}${accidental}${v.suffix}`} />
              </button>
            </Dialog.Close>
          ))}
        </div>
      </AppDialog>
    </>
  )
}
