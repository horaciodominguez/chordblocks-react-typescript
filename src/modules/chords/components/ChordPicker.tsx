// src/modules/chords/components/ChordPicker.tsx
import * as Popover from "@radix-ui/react-popover"
import { useState } from "react"

import { chordsData } from "@/modules/chords/data/chords" // <- tu data de acordes
import type { Action } from "@/modules/songs/state/songFormReducer"

type Props = {
  dispatch: React.Dispatch<Action>
}

export function ChordPicker({ dispatch }: Props) {
  const [root, setRoot] = useState("C")

  // raíces disponibles
  const ROOTS = Object.keys(chordsData) // suponiendo que chords.ts tiene { C: {...}, D: {...}, etc. }

  // variaciones para la raíz seleccionada
  const VARIATIONS = chordsData[root] ?? []

  const handleSelect = (variation: any) => {
    dispatch({
      type: "ADD_CHORD_NAME",
      v: variation.name,
      /* chord: {
        id: crypto.randomUUID(),
        name: `${root}${variation.suffix}`,
        diagram: variation.diagram, // svg u objeto según tu chords.ts
      }, */
    })
  }

  return (
    <Popover.Root>
      {/* Botón trigger */}
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-neutral-800">
          🎸
          <span>Elegir acorde</span>
        </button>
      </Popover.Trigger>

      {/* Contenido */}
      <Popover.Content
        side="bottom"
        align="center"
        className="z-50 w-96 rounded-xl border bg-neutral-900 p-4 shadow-xl"
      >
        {/* Select raíz */}
        <div className="mb-4">
          <label className="text-sm text-neutral-200">Raíz</label>
          <select
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white"
          >
            {ROOTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Grilla de variaciones */}
        <div className="grid grid-cols-3 gap-3">
          {VARIATIONS.map((v: any) => (
            <button
              key={v.name}
              onClick={() => handleSelect(v)}
              className="flex flex-col items-center rounded-lg border border-neutral-700 bg-neutral-800 p-2 hover:bg-indigo-600 hover:text-white"
            >
              <span className="mb-1 text-sm font-semibold">
                {root} <br />
                {v.name}
              </span>
              <svg
                className="w-16 h-20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                {/* <use href={`@/assets/acordes.svg#acorde-c`} /> */}
                <use
                  href={`/assets/chords-sprite.svg#${v.svgId}`}
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
  )
}
