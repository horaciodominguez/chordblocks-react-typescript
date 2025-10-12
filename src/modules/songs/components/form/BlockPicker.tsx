import { useState } from "react"
import { chordsData } from "@/modules/chords/data/chords"
import Label from "@/components/ui/Label"
import { AppDialog } from "@/components/ui/AppDialog"
import * as Dialog from "@radix-ui/react-dialog"
import type { Chord } from "@/modules/chords/types/chord.types"
import Button from "@/components/ui/Button"
import Rest from "@/modules/chords/components/Rest"
import ChordDisplay from "@/modules/chords/components/ChordDisplay"

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
  const VARIATIONS = chordsData[root] ?? []

  const handleSelect = (chordName: string) => {
    onSelect(chordName)
  }

  return (
    <>
      {label && <Label>{label}</Label>}

      <AppDialog
        trigger={
          <Button variant="primary" className="w-full">
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
                  <ChordDisplay chord={selectedValue} asText={false} />
                </span>
              )
            ) : (
              "Choose Block"
            )}
          </Button>
        }
        title="Choose Block"
      >
        <div className="mb-4">
          <Label htmlFor="root_chord">Root</Label>
          <select
            id="root_chord"
            name="root_chord"
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            className="w-full border-2 border-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ROOTS.map((r) => (
              <option key={r} value={r} className="bg-gray-800 text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        <Label htmlFor="variants">Variants</Label>
        <div className="grid grid-cols-3 gap-3" id="variants">
          {VARIATIONS.map((v: Chord) => (
            <Dialog.Close asChild key={v.name}>
              <button
                id={v.name}
                type="button"
                onClick={() => handleSelect(v.name)}
                className="flex flex-col items-center rounded-lg border border-gray-800 bg-zinc-900/10 p-2 hover:bg-indigo-600/10 hover:text-white"
              >
                <ChordDisplay chord={v.name} />
                <svg
                  className="w-16 h-16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <use
                    href={`/assets/chords-sprite.svg#${v.name}`}
                    className="text-white"
                    fill="currentColor"
                    width={64}
                    height={80}
                  />
                </svg>
              </button>
            </Dialog.Close>
          ))}
        </div>

        <div className="w-full border-t-2 border-zinc-700 mt-4"></div>

        <div className="mt-3 flex gap-2">
          <Dialog.Close asChild>
            <Button variant="primary" onClick={() => onSelect("__REST__")}>
              <Rest
                duration={Number(pendingBeats) || 1}
                beatsPerMeasure={beatsPerMeasure || 4}
              />
              Add Rest
            </Button>
          </Dialog.Close>
        </div>
      </AppDialog>
    </>
  )
}
