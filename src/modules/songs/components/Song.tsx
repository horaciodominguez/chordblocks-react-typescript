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
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start mb-4">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
          <h3 className="text-sm text-zinc-400">
            Artist:{" "}
            <span className="font-bold text-zinc-200">{song.artist}</span>
          </h3>
          {song.mainKey ? (
            <p className="text-sm text-zinc-400">
              Key:{" "}
              <span className="font-bold text-zinc-200">{song.mainKey}</span>
            </p>
          ) : null}
          <p className="text-sm text-zinc-400">
            Time Measure:{" "}
            <span className="font-bold text-zinc-200">
              {song.timeSignature.beatsPerMeasure} /{" "}
              {song.timeSignature.noteValue}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label htmlFor="toggle-diagrams" className="text-sm text-gray-400">
            Diagrams
          </label>
          <Switch.Root
            className="w-11 h-6 bg-zinc-700 rounded-full relative data-[state=checked]:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
            className="flex flex-col justify-start gap-3 mb-6"
          >
            <div className="flex items-center gap-2">
              <SectionTag typeName={section.type} />
              {section.repeats && section.repeats > 1 && (
                <span className="text-xs font-semibold text-blue-400 select-none">
                  ×{section.repeats}
                </span>
              )}
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
