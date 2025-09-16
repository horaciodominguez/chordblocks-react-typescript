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
    <div
      key={song.id ? song.id : null}
      className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium uppercase text-gray-200">{song.title}</h2>

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

      <h3 className="text-sm text-gray-400 mb-4">Artist: {song.artist}</h3>
      <p className="text-sm text-gray-400 mb-4">
        Time Measure: {song.timeSignature.beatsPerMeasure} /{" "}
        {song.timeSignature.noteValue}
      </p>
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
