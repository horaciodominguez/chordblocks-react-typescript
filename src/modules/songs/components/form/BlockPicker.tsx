import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import Input, { controlSurfaceClass } from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"
import Chord from "@/modules/chords/components/Chord"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import Rest from "@/modules/chords/components/Rest"
import { RiffMarker } from "@/modules/chords/components/RiffMarker"
import { SoloMarker } from "@/modules/chords/components/SoloMarker"
import { chordsData } from "@/modules/chords/data/chords"
import type { Chord as ChordType } from "@/modules/chords/types/chord.types"
import * as Dialog from "@radix-ui/react-dialog"
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
  onSelect: (chordName: string) => void
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
  const VARIATIONS = chordsData[root] ?? []

  const DISALLOW_SHARP = ["E", "B"]
  const DISALLOW_FLAT = ["F", "C"]

  const isSharpAllowed = (r: string) => !DISALLOW_SHARP.includes(r)
  const isFlatAllowed = (r: string) => !DISALLOW_FLAT.includes(r)

  const handleSelect = (chordName: string) => {
    onSelect(chordName)
  }

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
              <option value="" className="bg-zinc-800 text-white light:bg-white light:text-zinc-900">
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

        <Label htmlFor="variants">Variants</Label>
        <div
          className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 md:grid-cols-4"
          id="variants"
        >
          {VARIATIONS.map((v: ChordType) => (
            <Dialog.Close asChild key={v.name}>
              <button
                id={v.name}
                type="button"
                onClick={() => {
                  handleSelect(`${v.root}${accidental}${v.suffix}`)
                }}
                className="flex flex-col items-center rounded-lg border border-gray-800 bg-zinc-900/10 p-3 hover:bg-indigo-600/10 hover:text-white min-h-11 light:border-zinc-200 light:bg-white/90 light:hover:bg-indigo-100 light:hover:text-zinc-900"
              >
                <Chord chord={`${v.root}${accidental}${v.suffix}`} />
                <ChordDiagram chordName={`${v.root}${accidental}${v.suffix}`} />
              </button>
            </Dialog.Close>
          ))}
        </div>
      </AppDialog>
    </>
  )
}
