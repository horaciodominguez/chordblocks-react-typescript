import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import Input, { controlSurfaceClass } from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"
import Chord from "@/modules/chords/components/Chord"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import { VoicingDots } from "@/modules/chords/components/VoicingDots"
import Rest from "@/modules/chords/components/Rest"
import { RiffMarker } from "@/modules/chords/components/RiffMarker"
import { SoloMarker } from "@/modules/chords/components/SoloMarker"
import { FeelMarker } from "@/modules/chords/components/FeelMarker"
import { playChordPreview } from "@/modules/chords/audio/playChordPreview"
import {
  slashVariationsForPitch,
  voicingCount,
} from "@/modules/chords/data/chordFingerings"
import { chordsData } from "@/modules/chords/data/chords"
import type { Chord as ChordType } from "@/modules/chords/types/chord.types"
import {
  FEEL_MARKER_IDS,
  feelToken,
  isFeelToken,
  parseFeelToken,
} from "@/modules/songs/constants/feel"
import * as Dialog from "@radix-ui/react-dialog"
import { Volume2 } from "lucide-react"
import { useState } from "react"

export const REST_TOKEN = "__REST__"
export const SOLO_TOKEN = "__SOLO__"
export const RIFF_TOKEN_PREFIX = "__RIFF:"

export function riffToken(label?: string): string {
  const trimmed = label?.trim()
  return `${RIFF_TOKEN_PREFIX}${trimmed ?? ""}__`
}

export function parseRiffToken(token: string): string | undefined {
  if (!token.startsWith(RIFF_TOKEN_PREFIX) || !token.endsWith("__")) {
    return undefined
  }
  const inner = token.slice(RIFF_TOKEN_PREFIX.length, -2)
  return inner.trim() || undefined
}

export function isRiffToken(token: string): boolean {
  return token.startsWith(RIFF_TOKEN_PREFIX) && token.endsWith("__")
}

type Props = {
  /** `voicing` is omitted / 0 for primary fingering. */
  onSelect: (chordName: string, voicing?: number) => void
  pendingBeats: string
  beatsPerMeasure: number
  selectedValue?: string
  label?: string
}

export function BlockPicker({
  onSelect,
  pendingBeats,
  beatsPerMeasure,
  selectedValue,
  label,
}: Props) {
  const [root, setRoot] = useState("C")
  const ROOTS = Object.keys(chordsData)
  const [accidental, setAccidental] = useState<"" | "#" | "b">("")
  const [riffLabel, setRiffLabel] = useState("")
  /** Preview voicing per tile chord name (picker only). */
  const [tileVoicing, setTileVoicing] = useState<Record<string, number>>({})
  const VARIATIONS = chordsData[root] ?? []
  const pitch = `${root}${accidental}`
  const slashVariations = slashVariationsForPitch(pitch)
  const variantTiles = [
    ...VARIATIONS.map((v: ChordType) => ({
      key: `${v.root}${accidental}${v.suffix}`,
      chordName: `${v.root}${accidental}${v.suffix}`,
    })),
    ...slashVariations.map((s) => ({
      key: s.name,
      chordName: `${root}${accidental}${s.suffix}`,
    })),
  ]

  const DISALLOW_SHARP = ["E", "B"]
  const DISALLOW_FLAT = ["F", "C"]

  const isSharpAllowed = (r: string) => !DISALLOW_SHARP.includes(r)
  const isFlatAllowed = (r: string) => !DISALLOW_FLAT.includes(r)

  const selectedRiffLabel =
    selectedValue && isRiffToken(selectedValue)
      ? parseRiffToken(selectedValue)
      : undefined

  return (
    <>
      {label && <Label>{label}</Label>}

      <AppDialog
        trigger={
          <Button variant="primary" className="w-full min-h-11">
            {selectedValue ? (
              selectedValue === REST_TOKEN ? (
                <span className="inline-flex items-center">
                  <Rest
                    duration={Number(pendingBeats) || 1}
                    beatsPerMeasure={beatsPerMeasure || 4}
                  />
                  <span className="sr-only">Rest selected</span>
                </span>
              ) : selectedValue === SOLO_TOKEN ? (
                <SoloMarker />
              ) : isRiffToken(selectedValue) ? (
                <RiffMarker label={selectedRiffLabel} />
              ) : isFeelToken(selectedValue) ? (
                <FeelMarker feelId={parseFeelToken(selectedValue)!} />
              ) : (
                <span>
                  <Chord chord={selectedValue} asText={false} />
                </span>
              )
            ) : (
              "Choose Block"
            )}
          </Button>
        }
        title="Choose Block"
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 mb-4">
          <div className="flex-1">
            <Select
              name="root_chord"
              label="Root"
              options={ROOTS}
              value={root}
              onChange={(e) => {
                const newRoot = e.target.value
                setRoot(newRoot)
                if (
                  (accidental === "#" && !isSharpAllowed(newRoot)) ||
                  (accidental === "b" && !isFlatAllowed(newRoot))
                ) {
                  setAccidental("")
                }
              }}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="accidental_chord">Accidental</Label>
            <select
              id="accidental_chord"
              value={accidental}
              onChange={(e) => setAccidental(e.target.value as "" | "#" | "b")}
              className={`w-full px-3 py-2 ${controlSurfaceClass}`}
            >
              <option
                value=""
                className="bg-zinc-800 text-white light:bg-white light:text-zinc-900"
              >
                Natural
              </option>
              <option
                value="#"
                disabled={!isSharpAllowed(root)}
                className="bg-zinc-800 text-white disabled:text-zinc-500 light:bg-white light:text-zinc-900 light:disabled:text-zinc-400"
              >
                Sharp (#)
              </option>
              <option
                value="b"
                disabled={!isFlatAllowed(root)}
                className="bg-zinc-800 text-white disabled:text-zinc-500 light:bg-white light:text-zinc-900 light:disabled:text-zinc-400"
              >
                Flat (b)
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <Label htmlFor="rest">Rest</Label>
            <Dialog.Close asChild>
              <Button
                id="rest"
                variant="primary"
                onClick={() => onSelect(REST_TOKEN)}
                className="w-full flex flex-row gap-2 justify-center items-center min-h-11"
              >
                <Rest
                  duration={Number(pendingBeats) || 1}
                  beatsPerMeasure={beatsPerMeasure || 4}
                />
                Add Rest
              </Button>
            </Dialog.Close>
          </div>
          <div>
            <Label htmlFor="solo">Solo</Label>
            <Dialog.Close asChild>
              <Button
                id="solo"
                variant="primary"
                onClick={() => onSelect(SOLO_TOKEN)}
                className="w-full flex flex-row gap-2 justify-center items-center min-h-11"
              >
                <SoloMarker />
              </Button>
            </Dialog.Close>
          </div>
          <div>
            <Label htmlFor="riff-label">Riff</Label>
            <div className="flex gap-2 items-end">
              <Input
                id="riff-label"
                name="riff-label"
                alwaysEditable
                value={riffLabel}
                onChange={(e) => setRiffLabel(e.target.value)}
                placeholder="Riff 1"
                className="flex-1 min-w-0"
              />
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => onSelect(riffToken(riffLabel))}
                  className="min-h-11 shrink-0 px-3"
                >
                  Add
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </div>

        <Label>Feel</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {FEEL_MARKER_IDS.map((id) => (
            <Dialog.Close asChild key={id}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onSelect(feelToken(id))}
                className="min-h-11"
              >
                <FeelMarker feelId={id} />
              </Button>
            </Dialog.Close>
          ))}
        </div>

        <Label htmlFor="variants">Variants</Label>
        <div
          className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 md:grid-cols-4"
          id="variants"
        >
          {variantTiles.map((tile) => {
            const count = voicingCount(tile.chordName)
            const active = tileVoicing[tile.chordName] ?? 0
            return (
              <div
                key={tile.key}
                className="flex flex-col items-center rounded-lg border border-gray-800 bg-zinc-900/10 p-3 light:border-zinc-200 light:bg-white/90"
              >
                <Dialog.Close asChild>
                  <button
                    id={tile.key}
                    type="button"
                    onClick={() => {
                      onSelect(
                        tile.chordName,
                        active > 0 ? active : undefined,
                      )
                    }}
                    className="flex w-full flex-col items-center hover:text-white min-h-11 light:hover:text-zinc-900"
                  >
                    <Chord chord={tile.chordName} />
                    <ChordDiagram
                      chordName={tile.chordName}
                      voicing={active}
                    />
                  </button>
                </Dialog.Close>
                <VoicingDots
                  count={count}
                  active={active}
                  chordLabel={tile.chordName}
                  onChange={(index) => {
                    setTileVoicing((prev) => ({
                      ...prev,
                      [tile.chordName]: index,
                    }))
                  }}
                />
                <button
                  type="button"
                  aria-label={`Preview ${tile.chordName}`}
                  title="Preview chord"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    playChordPreview(tile.chordName, active)
                  }}
                  className="mt-1 flex items-center justify-center min-h-9 min-w-9 rounded-md text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800/50 light:text-zinc-600 light:hover:text-cyan-700 light:hover:bg-zinc-100"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      </AppDialog>
    </>
  )
}
