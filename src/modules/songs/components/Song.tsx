import type { Song as SongType } from "@/modules/songs/types/song.types"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import { Section } from "./Section"
import { useEffect, useMemo, useState } from "react"
import * as Switch from "@radix-ui/react-switch"
import { transposeSong } from "@/modules/chords/utils/transpose"
import { Minus, Plus } from "lucide-react"

export interface TemporarySong extends Omit<SongType, "id"> {
  id?: string
}

export interface Props {
  song: TemporarySong | SongType
}

const TRANSPOSE_MIN = -6
const TRANSPOSE_MAX = 6

function formatOffset(semitones: number): string {
  return semitones > 0 ? `+${semitones}` : String(semitones)
}

export const Song = ({ song }: Props) => {
  const [showDiagram, setShowDiagram] = useState(false)
  const [semitones, setSemitones] = useState(0)

  useEffect(() => {
    setSemitones(0)
  }, [song.id])

  const displaySong = useMemo(() => {
    if (semitones === 0) return song
    return transposeSong(song as SongType, semitones)
  }, [song, semitones])

  const badge =
    semitones !== 0
      ? song.mainKey && displaySong.mainKey
        ? `${formatOffset(semitones)} · ${song.mainKey} → ${displaySong.mainKey}`
        : formatOffset(semitones)
      : null

  return (
    <div key={song.id ? song.id : null} className="panel-variant-1">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start mb-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 gap-1">
          <h3 className="text-sm text-zinc-400">
            Artist:{" "}
            <span className="font-bold text-zinc-200">{song.artist}</span>
          </h3>
          {displaySong.mainKey ? (
            <p className="text-sm text-zinc-400">
              Key:{" "}
              <span className="font-bold text-zinc-200">
                {displaySong.mainKey}
              </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Transpose</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Transpose down"
                disabled={semitones <= TRANSPOSE_MIN}
                onClick={() =>
                  setSemitones((v) => Math.max(TRANSPOSE_MIN, v - 1))
                }
                className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-700 text-indigo-300 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Minus size={16} />
              </button>
              <span
                className="min-w-10 text-center text-sm font-semibold text-zinc-200 tabular-nums"
                aria-live="polite"
              >
                {formatOffset(semitones)}
              </span>
              <button
                type="button"
                aria-label="Transpose up"
                disabled={semitones >= TRANSPOSE_MAX}
                onClick={() =>
                  setSemitones((v) => Math.min(TRANSPOSE_MAX, v + 1))
                }
                className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-700 text-indigo-300 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus size={16} />
              </button>
            </div>
            {badge ? (
              <span className="text-xs font-medium text-amber-400/90 bg-amber-400/10 border border-amber-500/30 rounded px-2 py-1">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
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
      </div>

      <ul>
        {displaySong.songSections.map((section) => (
          <li
            key={section.id}
            className="flex flex-col justify-start gap-3 mb-6"
          >
            <div className="flex items-center gap-2">
              <SectionTag typeName={section.type} label={section.label} />
              {section.repeats && section.repeats > 1 && (
                <span className="text-xs font-semibold text-blue-400 select-none">
                  ×{section.repeats}
                </span>
              )}
            </div>
            <Section
              section={section}
              timeSignature={displaySong.timeSignature}
              showDiagram={showDiagram}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
