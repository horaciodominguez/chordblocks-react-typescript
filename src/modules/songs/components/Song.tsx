import type { Song as SongType } from "@/modules/songs/types/song.types"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import { Section } from "./Section"
import { useState } from "react"
import * as Switch from "@radix-ui/react-switch"

export interface TemporarySong extends Omit<SongType, "id"> {
  id?: string
}

export interface Props {
  song: TemporarySong | SongType
}

export const Song = ({ song }: Props) => {
  const [showDiagram, setShowDiagram] = useState(false)

  return (
    <div key={song.id ? song.id : null} className="panel-variant-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-row gap-4">
          <h3 className="text-sm text-zinc-400 mb-4">
            Artist:{" "}
            <span className="font-bold text-zinc-200">{song.artist}</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Time Measure:{" "}
            <span className="font-bold text-zinc-200">
              {song.timeSignature.beatsPerMeasure} /{" "}
              {song.timeSignature.noteValue}
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <label htmlFor="toggle-diagrams" className="text-sm text-gray-400">
            Toggle diagrams
          </label>
          <Switch.Root
            className="w-10 h-6 bg-zinc-700 rounded-full relative data-[state=checked]:bg-green-600"
            id="toggle-diagrams"
            checked={showDiagram}
            onCheckedChange={setShowDiagram}
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transform translate-x-1 transition-transform data-[state=checked]:translate-x-5" />
          </Switch.Root>
        </div>
      </div>

      <ul>
        {song.songSections.map((section) => (
          <li
            key={section.id}
            className="flex flex-col justify-start gap-4 mb-4 "
          >
            <div>
              <SectionTag typeName={section.type} />
            </div>
            <Section
              section={section}
              timeSignature={song.timeSignature}
              showDiagram={showDiagram}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
