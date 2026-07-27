import { useState } from "react"
import {
  readChordPreviewPreference,
  writeChordPreviewPreference,
} from "@/modules/chords/audio/chordPreviewPreference"

type Props = {
  id?: string
}

/** Settings toggle for optional chord preview in BlockPicker. */
export function ChordPreviewToggle({ id = "chord-preview" }: Props) {
  const [enabled, setEnabled] = useState(readChordPreviewPreference)

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer min-h-11"
    >
      <input
        id={id}
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          const next = e.target.checked
          setEnabled(next)
          writeChordPreviewPreference(next)
        }}
        className="h-4 w-4 rounded border-zinc-600 text-indigo-500 focus:ring-indigo-500 light:border-zinc-300"
      />
      <span className="text-sm text-zinc-300 light:text-zinc-800">
        Chord preview sound in editor (BlockPicker speaker button)
      </span>
    </label>
  )
}
