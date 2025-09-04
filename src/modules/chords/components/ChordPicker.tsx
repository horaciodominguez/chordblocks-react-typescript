import * as Popover from "@radix-ui/react-popover"
import { useState } from "react"

import { chordsData } from "@/modules/chords/data/chords"
import type { Action } from "@/modules/songs/state/songFormReducer"
import Label from "@/components/ui/Label"
import type { Chord } from "../types/chord.types"

type Props = {
  dispatch: React.Dispatch<Action>
  label?: string
}

export function ChordPicker({ dispatch, label }: Props) {
  const [root, setRoot] = useState("C")

  const ROOTS = Object.keys(chordsData)
  const VARIATIONS = chordsData[root] ?? []

  return (
    <>
      <Label>{label}</Label>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="w-full border border-gray-900 px-3 py-2 rounded-md flex items-center justify-center gap-2 hover:border-gray-700 hover:bg-gray-800">
            🎸
            <span>Choose chord</span>
          </button>
        </Popover.Trigger>

        <Popover.Content
          side="bottom"
          align="center"
          className="z-50 w-96 rounded-md bg-zinc-900/5 backdrop-blur-sm border-2 border-gray-800 p-4 shadow-xl"
        >
          <div className="mb-4">
            <label className="text-sm text-neutral-200">Root chord</label>
            <select
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              className="w-full border-2 border-gray-900 px-3 py-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROOTS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <label className="text-sm text-neutral-200">Variants</label>
          <div className="grid grid-cols-3 gap-3">
            {VARIATIONS.map((v: Chord) => (
              <button
                type="button"
                key={v.name}
                onClick={() => dispatch({ type: "ADD_CHORD_NAME", v: v.name })}
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
            ))}
          </div>

          <Popover.Arrow className="fill-neutral-900" />
        </Popover.Content>
      </Popover.Root>
    </>
  )
}
