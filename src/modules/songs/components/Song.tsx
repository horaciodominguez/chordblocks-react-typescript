import type { Song as SongType } from "@/modules/songs/types/song.types"
import type { SongDensity } from "@/modules/songs/types/density.types"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import { panelFlatClass } from "@/components/ui/Panel"
import { Section } from "./Section"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import * as Switch from "@radix-ui/react-switch"
import { transposeSong } from "@/modules/chords/utils/transpose"
import {
  readDensityPreference,
  writeDensityPreference,
} from "@/modules/songs/utils/densityPreference"
import { useSongPlayer } from "@/modules/player/hooks/useSongPlayer"
import { Minus, Plus, Youtube } from "lucide-react"

export interface TemporarySong extends Omit<SongType, "id"> {
  id?: string
}

export interface Props {
  song: TemporarySong | SongType
  /**
   * Starting transpose from a repertoire item (F11).
   * Session stepper adjusts from this; does not mutate the song or set until saved in editor.
   */
  baseSemitones?: number
  /** F13: atril — force guide density, hide edit chrome */
  performanceMode?: boolean
  /** Optional link for the artist name (catalog by artist). */
  artistHref?: string
}

const TRANSPOSE_MIN = -12
const TRANSPOSE_MAX = 12

function formatOffset(semitones: number): string {
  return semitones > 0 ? `+${semitones}` : String(semitones)
}

export const Song = ({
  song,
  baseSemitones = 0,
  performanceMode = false,
  artistHref,
}: Props) => {
  const [showDiagram, setShowDiagram] = useState(false)
  const player = useSongPlayer()
  const [semitones, setSemitones] = useState(baseSemitones)
  const [density, setDensity] = useState<SongDensity>(() =>
    performanceMode ? "guide" : readDensityPreference(),
  )

  useEffect(() => {
    setSemitones(baseSemitones)
  }, [song.id, baseSemitones])

  useEffect(() => {
    if (performanceMode) {
      setDensity("guide")
      setShowDiagram(false)
    }
  }, [performanceMode])

  const setDensityAndPersist = (next: SongDensity) => {
    if (performanceMode) return
    setDensity(next)
    writeDensityPreference(next)
    if (next === "guide") setShowDiagram(false)
  }

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

  const effectiveDensity: SongDensity = performanceMode ? "guide" : density
  const diagramsEnabled = effectiveDensity === "bars" && showDiagram

  return (
    <div
      key={song.id ? song.id : null}
      className={`${panelFlatClass} ${performanceMode ? "border-0 bg-transparent p-0 shadow-none" : ""}`}
      data-density={effectiveDensity}
    >
      {!performanceMode ? (
        <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-zinc-700/50 light:border-zinc-200">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-zinc-400 light:text-zinc-600">
            <span>
              Artist:{" "}
              {artistHref ? (
                <Link
                  to={artistHref}
                  className="font-semibold text-zinc-200 hover:text-indigo-300 light:text-zinc-900 light:hover:text-indigo-700"
                >
                  {song.artist}
                </Link>
              ) : (
                <span className="font-semibold text-zinc-200 light:text-zinc-900">
                  {song.artist}
                </span>
              )}
            </span>
            {displaySong.mainKey ? (
              <span>
                Key:{" "}
                <span className="font-semibold text-zinc-200 light:text-zinc-900">
                  {displaySong.mainKey}
                </span>
              </span>
            ) : null}
            <span>
              Meter:{" "}
              <span className="font-semibold text-zinc-200 light:text-zinc-900">
                {song.timeSignature.beatsPerMeasure}/
                {song.timeSignature.noteValue}
              </span>
            </span>
            {player.videoId ? (
              <button
                type="button"
                onClick={() => (player.isOpen ? player.close() : player.open())}
                aria-pressed={player.isOpen}
                title="Listen to the YouTube reference"
                className={`inline-flex items-center gap-1.5 self-center min-h-9 rounded-md border px-2.5 text-xs font-semibold transition-colors ${
                  player.isOpen
                    ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300 light:border-indigo-400 light:bg-indigo-50 light:text-indigo-700"
                    : "border-zinc-600 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 light:border-zinc-300 light:text-zinc-700 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                }`}
              >
                <Youtube size={14} className="text-red-500" />
                Listen
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-400 light:text-zinc-600">
                Transpose
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Transpose down"
                  disabled={semitones <= TRANSPOSE_MIN}
                  onClick={() =>
                    setSemitones((v) => Math.max(TRANSPOSE_MIN, v - 1))
                  }
                  className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none light:border-zinc-300 light:text-zinc-900 light:hover:bg-zinc-100"
                >
                  <Minus size={16} />
                </button>
                <span
                  className="min-w-10 text-center text-sm font-semibold text-zinc-200 tabular-nums light:text-zinc-900"
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
                  className="flex items-center justify-center min-h-11 min-w-11 rounded-md border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none light:border-zinc-300 light:text-zinc-900 light:hover:bg-zinc-100"
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

            <div
              className="flex items-center gap-1 sm:pl-4 sm:border-l sm:border-zinc-700/60 light:sm:border-zinc-200"
              role="group"
              aria-label="View density"
            >
              <span className="text-sm text-zinc-400 mr-1 light:text-zinc-600">
                View
              </span>
              <div className="flex rounded-md border border-zinc-600 overflow-hidden light:border-zinc-300">
                <button
                  type="button"
                  aria-pressed={density === "guide"}
                  onClick={() => setDensityAndPersist("guide")}
                  className={`min-h-11 px-3 text-sm font-medium transition-colors ${
                    density === "guide"
                      ? "bg-zinc-600 text-zinc-100 light:bg-zinc-300 light:text-zinc-900"
                      : "bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                  }`}
                >
                  Guide
                </button>
                <button
                  type="button"
                  aria-pressed={density === "bars"}
                  onClick={() => setDensityAndPersist("bars")}
                  className={`min-h-11 px-3 text-sm font-medium border-l border-zinc-600 transition-colors light:border-zinc-300 ${
                    density === "bars"
                      ? "bg-zinc-600 text-zinc-100 light:bg-zinc-300 light:text-zinc-900"
                      : "bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                  }`}
                >
                  Bars
                </button>
              </div>
            </div>

            {density === "bars" ? (
              <div className="flex items-center gap-3 sm:pl-4 sm:border-l sm:border-zinc-700/60 light:sm:border-zinc-200">
                <label
                  htmlFor="toggle-diagrams"
                  className="text-sm text-zinc-400 light:text-zinc-600"
                >
                  Diagrams
                </label>
                <Switch.Root
                  className="w-11 h-6 bg-zinc-700 rounded-full relative data-[state=checked]:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 light:bg-zinc-300"
                  id="toggle-diagrams"
                  checked={showDiagram}
                  onCheckedChange={setShowDiagram}
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transform translate-x-1 transition-transform data-[state=checked]:translate-x-5" />
                </Switch.Root>
              </div>
            ) : null}
          </div>
        </div>
      ) : badge ? (
        <div className="mb-2">
          <span className="text-xs font-medium text-amber-400/90 bg-amber-400/10 border border-amber-500/30 rounded px-2 py-1">
            {badge}
          </span>
        </div>
      ) : null}

      <ul className={performanceMode ? "mt-1" : undefined}>
        {displaySong.songSections.map((section) => (
          <li
            key={section.id}
            className={`flex flex-col justify-start gap-3 guide:gap-1 ${
              performanceMode ? "mb-4" : "mb-6 guide:mb-2"
            }`}
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
              showDiagram={diagramsEnabled}
              density={effectiveDensity}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
