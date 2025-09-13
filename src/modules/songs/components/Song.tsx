import type { Song as SongType } from "@/modules/songs/types/song.types"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import { Section } from "./Section"

export interface TemporarySong extends Omit<SongType, "id"> {
  id?: string
}

export interface Props {
  song: TemporarySong | SongType
}

export const Song = ({ song }: Props) => {
  return (
    <div
      key={song.id ? song.id : null}
      className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md p-4 shadow-sm"
    >
      <h2 className="font-medium uppercase text-gray-200 mb-4">{song.title}</h2>
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
            <Section section={section} timeSignature={song.timeSignature} />
          </li>
        ))}
      </ul>
    </div>
  )
}
