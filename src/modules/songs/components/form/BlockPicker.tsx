import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import { controlSurfaceClass } from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"
import Chord from "@/modules/chords/components/Chord"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import { VoicingDots } from "@/modules/chords/components/VoicingDots"
import Rest from "@/modules/chords/components/Rest"
import { InstrumentalMarker } from "@/modules/chords/components/InstrumentalMarker"
import { playChordPreview } from "@/modules/chords/audio/playChordPreview"
import {
  slashVariationsForPitch,
  voicingCount,
} from "@/modules/chords/data/chordFingerings"
import { chordsData } from "@/modules/chords/data/chords"
import type { Chord as ChordType } from "@/modules/chords/types/chord.types"
import * as Dialog from "@radix-ui/react-dialog"
import { Volume2 } from "lucide-react"
import { useState } from "react"

export const REST_TOKEN = "__REST__"
export const SOLO_TOKEN = "__SOLO__"
export const RIFF_TOKEN = "__RIFF__"

/** @deprecated Use RIFF_TOKEN — kept for any leftover `__RIFF:…__` callers. */
export const RIFF_TOKEN_PREFIX = "__RIFF:"

export function riffToken(_label?: string): string {
  return RIFF_TOKEN
}

export function isRiffToken(token: string): boolean {
  return (
    token === RIFF_TOKEN ||
    (token.startsWith(RIFF_TOKEN_PREFIX) && token.endsWith("__"))
  )
}

type Props = {
  /** `voicing` is omitted / 0 for primary fingering. */
  onSelect: (chordName: string, voicing?: number) => void
  pendingBeats: string
  beatsPerMeasure: number
  selectedValue?: string
  label?: string
  /**
   * Controlled dialog without a “Choose Block” trigger.
   * When true, `open` + `onOpenChange` are required.
   */
  headless?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  noteValue?: number
}

function BlockPickerBody({
  onSelect,
  pendingBeats,
  beatsPerMeasure,
  noteValue = 4,
}: {
  onSelect: (chordName: string, voicing?: number) => void
  pendingBeats: string
  beatsPerMeasure: number
  noteValue?: number
}) {
  const [root, setRoot] = useState("C")
  const ROOTS = Object.keys(chordsData)
  const [accidental, setAccidental] = useState<"" | "#" | "b">("")
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

  return (
    <>
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
                noteValue={noteValue}
              />
              Add Rest
            </Button>
          </Dialog.Close>
        </div>
        <div>
          <Label htmlFor="riff">Riff</Label>
          <Dialog.Close asChild>
            <Button
              id="riff"
              variant="primary"
              onClick={() => onSelect(RIFF_TOKEN)}
              className="w-full flex flex-row gap-2 justify-center items-center min-h-11"
            >
              <InstrumentalMarker kind="riff" />
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
              <InstrumentalMarker kind="solo" />
            </Button>
          </Dialog.Close>
        </div>
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
    </>
  )
}

export function BlockPicker({
  onSelect,
  pendingBeats,
  beatsPerMeasure,
  selectedValue,
  label,
  headless = false,
  open,
  onOpenChange,
  noteValue = 4,
}: Props) {
  const trigger =
    headless ? undefined : (
      <Button variant="primary" className="w-full min-h-11">
        {selectedValue ? (
          selectedValue === REST_TOKEN ? (
            <span className="inline-flex items-center">
              <Rest
                duration={Number(pendingBeats) || 1}
                beatsPerMeasure={beatsPerMeasure || 4}
                noteValue={noteValue}
              />
              <span className="sr-only">Rest selected</span>
            </span>
          ) : selectedValue === SOLO_TOKEN ? (
            <InstrumentalMarker kind="solo" />
          ) : isRiffToken(selectedValue) ? (
            <InstrumentalMarker kind="riff" />
          ) : (
            <span>
              <Chord chord={selectedValue} asText={false} />
            </span>
          )
        ) : (
          "Choose Block"
        )}
      </Button>
    )

  return (
    <>
      {!headless && label ? <Label>{label}</Label> : null}

      <AppDialog
        trigger={trigger}
        title="Choose Block"
        {...(headless && open !== undefined && onOpenChange
          ? { open, onOpenChange }
          : {})}
      >
        <BlockPickerBody
          onSelect={onSelect}
          pendingBeats={pendingBeats}
          beatsPerMeasure={beatsPerMeasure}
          noteValue={noteValue}
        />
      </AppDialog>
    </>
  )
}
