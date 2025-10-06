import { useState } from "react"
import { chordsData } from "@/modules/chords/data/chords"
import Label from "@/components/ui/Label"
import { AppDialog } from "@/components/ui/AppDialog"
import * as Dialog from "@radix-ui/react-dialog"
import type { Chord } from "../types/chord.types"

type Props = {
  onSelect: (chordName: string) => void
  selectedValue?: string
  label?: string
}

export function ChordPicker({ onSelect, selectedValue, label }: Props) {
  const [root, setRoot] = useState("C")

  const ROOTS = Object.keys(chordsData)
  const VARIATIONS = chordsData[root] ?? []

  const handleSelect = (chordName: string) => {
    onSelect(chordName)
  }

  return (
    <div>
      {label && <Label>{label}</Label>}

      <AppDialog
        trigger={
          <button className="w-full border border-zinc-700 px-3 py-2 rounded-md flex items-center justify-center gap-2 hover:border-gray-700 hover:bg-gray-800">
            <span>{selectedValue ? selectedValue : "Choose Chord"}</span>
          </button>
        }
        title="Choose a chord"
      >
        <div className="mb-4">
          <label className="text-sm text-neutral-200" htmlFor="root_chord">
            Root chord
          </label>
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

        <label className="text-sm text-zinc-200" htmlFor="variants">
          Variants
        </label>
        <div className="grid grid-cols-3 gap-3" id="variants">
          {VARIATIONS.map((v: Chord) => (
            <Dialog.Close asChild key={v.name}>
              <button
                id={v.name}
                type="button"
                onClick={() => handleSelect(v.name)}
                className="flex flex-col items-center rounded-lg border border-gray-800 bg-zinc-900/10 p-2 hover:bg-indigo-600/10 hover:text-white"
              >
                <span className="mb-1 text-sm font-semibold">{v.name}</span>
                <svg
                  className="w-16 h-20"
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
            <button
              type="button"
              onClick={() => onSelect("__REST__")}
              className="px-3 py-1 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
              title="Add rest"
            >
              Add Rest
            </button>
          </Dialog.Close>
        </div>
      </AppDialog>
    </div>
  )
}
