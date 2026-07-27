import { Select } from "@/components/ui/Select"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import {
  BLOCK_BEAT_VALUES,
  BEAT_VALUES,
  noteValues,
  SECTION_OPTIONS,
} from "@/modules/songs/constants/song"
import type {
  SectionType,
  SongSection,
} from "@/modules/songs/types/section.types"
import Button from "@/components/ui/Button"
import { toast } from "sonner"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import BarsReorder from "./BarsReorder"
import type React from "react"
import { BlockPicker } from "./BlockPicker"
import { AddBlockSlot } from "./AddBlockSlot"
import { DraftBlockInsert } from "./DraftBlockInsert"
import {
  feelMarkerLabel,
  isFeelMarkerId,
} from "@/modules/songs/constants/feel"
import Input from "@/components/ui/Input"
import InputField from "@/components/ui/InputField"
import { effectiveTimeSignature } from "@/modules/songs/utils/effectiveTimeSignature"
import {
  formatCueTime,
  parseCueTimeInput,
} from "@/modules/songs/utils/scrollSync"
import { nextBeatsValue, remainingBeats, barCapacity } from "@/modules/songs/utils/beats"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
  onStopEditing: () => void
}

function hasConfirmablePendingBlock(
  block: SongFormState["pendingBlock"],
): boolean {
  if (!block) return false
  return (
    block.type === "rest" ||
    block.type === "riff" ||
    block.type === "solo" ||
    block.type === "feel" ||
    !!block.chord?.name
  )
}

export function SectionEditor({ state, dispatch, onStopEditing }: Props) {
  const [cueDraft, setCueDraft] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [flashBlockId, setFlashBlockId] = useState<string | null>(null)
  const sectionTs = effectiveTimeSignature(
    state.song.timeSignature,
    state.pendingSection.timeSignature,
  )
  const hasMeterOverride = state.pendingSection.timeSignature != null
  const showDraft = hasConfirmablePendingBlock(state.pendingBlock)
  const beatOptions = BLOCK_BEAT_VALUES.filter((v) => v <= state.availableBeats)

  const bars = state.pendingSection.bars
  const lastBarIndex = bars.length - 1
  const lastBar = lastBarIndex >= 0 ? bars[lastBarIndex] : undefined
  const lastBarRemaining = lastBar
    ? remainingBeats(
        lastBar,
        barCapacity(
          sectionTs.beatsPerMeasure,
          lastBarIndex,
          state.pendingSection.pickupBeats,
        ),
      )
    : 0
  /** Space left in the last measure → slot sits to the right and fills it. */
  const slotInline = Boolean(lastBar && lastBarRemaining > 0)
  const slotBeats = slotInline
    ? lastBarRemaining
    : sectionTs.beatsPerMeasure

  useEffect(() => {
    setCueDraft(
      typeof state.pendingSection.cueTime === "number"
        ? formatCueTime(state.pendingSection.cueTime)
        : "",
    )
  }, [state.pendingSection.id, state.pendingSection.cueTime])

  useEffect(() => {
    if (!flashBlockId) return
    const t = window.setTimeout(() => setFlashBlockId(null), 700)
    return () => window.clearTimeout(t)
  }, [flashBlockId])

  useEffect(() => {
    if (!showDraft) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        dispatch({ type: "CLEAR_PENDING_BLOCK" })
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [showDraft, dispatch])

  const commitCueDraft = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === "") {
      dispatch({ type: "SET_PENDING_SECTION_CUE_TIME", v: undefined })
      setCueDraft("")
      return
    }
    const parsed = parseCueTimeInput(trimmed)
    if (parsed === undefined) {
      setCueDraft(
        typeof state.pendingSection.cueTime === "number"
          ? formatCueTime(state.pendingSection.cueTime)
          : "",
      )
      return
    }
    dispatch({ type: "SET_PENDING_SECTION_CUE_TIME", v: parsed })
    setCueDraft(formatCueTime(parsed))
  }

  const openPicker = () => {
    dispatch({
      type: "ADD_BEATS",
      v: nextBeatsValue(state.availableBeats || sectionTs.beatsPerMeasure),
    })
    setPickerOpen(true)
  }

  const confirmDraft = () => {
    const pb = state.pendingBlock
    if (!hasConfirmablePendingBlock(pb)) return
    const newBlockId = uuidv4()
    dispatch({ type: "ADD_BLOCK", newBlockId })
    setFlashBlockId(newBlockId)
    const label =
      pb?.type === "rest"
        ? "Rest"
        : pb?.type === "solo"
          ? "Solo"
          : pb?.type === "riff"
            ? pb.label?.trim() || "Riff"
            : pb?.type === "feel" && pb.label && isFeelMarkerId(pb.label)
              ? feelMarkerLabel(pb.label)
              : (pb?.chord?.name ?? "Block")
    toast.info(`Block ${label} added to pending section`)
  }

  const appendSlot =
    showDraft && state.pendingBlock ? (
      <DraftBlockInsert
        block={state.pendingBlock}
        timeSignature={sectionTs}
        pendingBeats={state.pendingBeats}
        beatOptions={beatOptions}
        slotBeats={slotBeats}
        onBeatsChange={(v) => dispatch({ type: "ADD_BEATS", v })}
        onConfirm={confirmDraft}
        onCancel={() => dispatch({ type: "CLEAR_PENDING_BLOCK" })}
      />
    ) : (
      <AddBlockSlot onClick={openPicker} beats={slotBeats} />
    )

  return (
    <div className="border border-gray-700 bg-black/20 rounded-md p-3 sm:p-4 shadow-sm light:border-zinc-200 light:bg-white/90">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Select
            name="sectionType"
            label="Section Type"
            options={SECTION_OPTIONS}
            onChange={(e) => {
              if (e.target.value) {
                dispatch({
                  type: "ADD_SECTION_TYPE",
                  v: e.target.value as SectionType,
                })
              }
            }}
            value={state.pendingSection.type}
            defaultValue="Select Section Type"
          />
        </div>
        <div className="w-full sm:w-1/2 flex justify-start sm:justify-end items-end">
          {state.pendingSection.id !== "" && (
            <div className="flex flex-wrap justify-start items-center gap-3">
              <label
                htmlFor="section-repeat"
                className="flex justify-center items-center gap-2 min-h-11"
              >
                <input
                  id="section-repeat"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={(state.pendingSection.repeats ?? 1) > 1}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({ type: "SET_PENDING_SECTION_REPEATS", v: 2 })
                    } else {
                      dispatch({ type: "SET_PENDING_SECTION_REPEATS", v: 1 })
                    }
                  }}
                />
                Repeat
              </label>

              <div className="flex items-center gap-2">
                <Input
                  name="repeats"
                  type="number"
                  min={2}
                  value={state.pendingSection.repeats ?? 1}
                  onChange={(e) => {
                    const v = Math.max(2, parseInt(e.target.value || "2", 10))
                    dispatch({ type: "SET_PENDING_SECTION_REPEATS", v })
                  }}
                  disabled={(state.pendingSection.repeats ?? 1) === 1}
                />
                <span className="text-xs">Times</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <InputField
            label="Label (optional)"
            name="sectionLabel"
            value={state.pendingSection.label ?? ""}
            onChange={(e) => {
              dispatch({
                type: "SET_PENDING_SECTION_LABEL",
                v: e.target.value === "" ? undefined : e.target.value,
              })
            }}
          />
          <p className="text-xs text-zinc-500 mt-1 light:text-zinc-600">
            Keep-style name shown as [A]. Leave empty to show the section type.
          </p>
        </div>
      )}

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <InputField
            label="Sync time (optional)"
            name="sectionCueTime"
            alwaysEditable
            placeholder="m:ss — e.g. 1:22"
            value={cueDraft}
            onChange={(e) => {
              const next = e.target.value
              setCueDraft(next)
              const trimmed = next.trim()
              if (trimmed === "") {
                dispatch({ type: "SET_PENDING_SECTION_CUE_TIME", v: undefined })
                return
              }
              const parsed = parseCueTimeInput(trimmed)
              if (parsed !== undefined) {
                dispatch({ type: "SET_PENDING_SECTION_CUE_TIME", v: parsed })
              }
            }}
            onBlur={() => commitCueDraft(cueDraft)}
          />
          <p className="text-xs text-zinc-500 mt-1 light:text-zinc-600">
            Play auto-scroll cue: when the song/video reaches this time, this
            section should be at the top. Mark only the parts you need — scroll
            stops at the last cue.
          </p>
        </div>
      )}

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-24">
                <Select
                  name="sectionBeatsPerMeasure"
                  label="Section beats"
                  options={BEAT_VALUES}
                  value={sectionTs.beatsPerMeasure.toString()}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_PENDING_SECTION_TIME_SIGNATURE",
                      v: {
                        beatsPerMeasure: parseInt(e.target.value, 10),
                        noteValue: sectionTs.noteValue,
                      },
                    })
                  }}
                />
              </div>
              <div className="flex-1 sm:w-24">
                <Select
                  name="sectionNoteValue"
                  label="Section note"
                  options={noteValues}
                  value={sectionTs.noteValue.toString()}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_PENDING_SECTION_TIME_SIGNATURE",
                      v: {
                        beatsPerMeasure: sectionTs.beatsPerMeasure,
                        noteValue: parseInt(e.target.value, 10),
                      },
                    })
                  }}
                />
              </div>
            </div>
            {hasMeterOverride ? (
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 shrink-0"
                onClick={() =>
                  dispatch({
                    type: "SET_PENDING_SECTION_TIME_SIGNATURE",
                    v: undefined,
                  })
                }
              >
                Use song {state.song.timeSignature.beatsPerMeasure}/
                {state.song.timeSignature.noteValue}
              </Button>
            ) : (
              <p className="text-xs text-zinc-500 pb-2 light:text-zinc-600">
                Using song default (
                {state.song.timeSignature.beatsPerMeasure}/
                {state.song.timeSignature.noteValue}). Change selects to
                override.
              </p>
            )}
          </div>
        </div>
      )}

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <Select
            name="sectionPickupBeats"
            label="Pickup (anacrusis)"
            options={[
              "Off",
              ...Array.from(
                { length: Math.max(0, sectionTs.beatsPerMeasure - 1) },
                (_, i) => String(i + 1),
              ),
            ]}
            value={
              state.pendingSection.pickupBeats != null
                ? String(state.pendingSection.pickupBeats)
                : "Off"
            }
            onChange={(e) => {
              const raw = e.target.value
              dispatch({
                type: "SET_PENDING_SECTION_PICKUP_BEATS",
                v: raw === "Off" ? undefined : parseInt(raw, 10),
              })
            }}
          />
          <p className="text-xs text-zinc-500 mt-1 light:text-zinc-600">
            Incomplete first bar (e.g. 1 beat before the first full measure).
          </p>
        </div>
      )}

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <h2 className="mb-4">Pending Section</h2>

          <div className="mb-4 flex items-center gap-2">
            <SectionTag
              typeName={state.pendingSection.type}
              label={state.pendingSection.label}
            />
            {(state.pendingSection.repeats ?? 1) > 1 && (
              <span className="text-xs font-semibold text-blue-400 light:text-blue-600">
                ×{state.pendingSection.repeats}
              </span>
            )}
            {hasMeterOverride ? (
              <span className="text-[10px] font-semibold tabular-nums text-violet-400 light:text-violet-700">
                {sectionTs.beatsPerMeasure}/{sectionTs.noteValue}
              </span>
            ) : null}
            {state.pendingSection.pickupBeats ? (
              <span className="text-[10px] font-semibold tabular-nums text-cyan-400 light:text-cyan-700">
                Pickup {state.pendingSection.pickupBeats}
              </span>
            ) : null}
          </div>

          {state.pendingSection.bars.length > 0 ? (
            <BarsReorder
              section={state.pendingSection as SongSection}
              timeSignature={sectionTs}
              flashBlockId={flashBlockId}
              lastBarEndSlot={slotInline ? appendSlot : undefined}
              afterBarsSlot={!slotInline ? appendSlot : undefined}
              onReorder={(newBars) =>
                dispatch({
                  type: "REORDER_BARS_IN_SECTION",
                  sectionId: state.pendingSection.id,
                  order: newBars.map((b) => b.id),
                })
              }
              onReorderBlocks={(barId, newBlocks) =>
                dispatch({
                  type: "REORDER_BLOCKS",
                  barId,
                  order: newBlocks.map((c) => c.id),
                })
              }
              onDeleteChord={(blockId) => {
                dispatch({
                  type: "DELETE_BLOCK",
                  v: blockId,
                })
              }}
              onUpdateDuration={(blockId, duration) => {
                dispatch({
                  type: "UPDATE_BLOCK_DURATION",
                  blockId,
                  duration,
                })
              }}
              onUpdateVoicing={(blockId, voicing) => {
                dispatch({
                  type: "UPDATE_BLOCK_VOICING",
                  blockId,
                  voicing,
                })
              }}
              onUpdateRefTime={(blockId, refTime) => {
                dispatch({
                  type: "UPDATE_BLOCK_REF_TIME",
                  blockId,
                  refTime,
                })
              }}
              onUpdateLyric={(blockId, lyric) => {
                dispatch({
                  type: "UPDATE_BLOCK_LYRIC",
                  blockId,
                  lyric,
                })
              }}
              hasYoutubeUrl={Boolean(state.song.youtubeUrl)}
            />
          ) : (
            <div className="flex min-h-48 w-full min-w-0 max-w-sm items-stretch">
              {appendSlot}
            </div>
          )}

          <BlockPicker
            headless
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            beatsPerMeasure={sectionTs.beatsPerMeasure}
            pendingBeats={state.pendingBeats}
            onSelect={(chordName, voicing) => {
              dispatch({
                type: "ADD_BLOCK_TEMPORARY",
                v: chordName,
                ...(voicing != null && voicing > 0 ? { voicing } : {}),
              })
              setPickerOpen(false)
            }}
          />

          <div className="mb-4 flex flex-wrap gap-3 mt-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={() => {
                dispatch({
                  type:
                    state.editingSectionId === null
                      ? "CANCEL_SECTION"
                      : "CANCEL_EDIT_SECTION",
                })
                onStopEditing()
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="min-h-11"
              onClick={() => {
                commitCueDraft(cueDraft)
                dispatch({
                  type:
                    state.editingSectionId === null ||
                    state.editingSectionId === undefined
                      ? "FINALIZE_SECTION"
                      : "UPDATE_SECTION",
                })
                onStopEditing()
                if (state.errors?.songSections) {
                  dispatch({ type: "CLEAR_ERROR", field: "songSections" })
                }
                toast.info(`${state.pendingSection.type} section saved`)
              }}
            >
              Save Section
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
