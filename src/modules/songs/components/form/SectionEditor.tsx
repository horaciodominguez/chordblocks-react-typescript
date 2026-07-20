import { Select } from "@/components/ui/Select"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import { BLOCK_BEAT_VALUES, SECTION_OPTIONS } from "@/modules/songs/constants/song"
import type {
  SectionType,
  SongSection,
} from "@/modules/songs/types/section.types"
import Button from "@/components/ui/Button"
import { toast } from "sonner"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"
import BarsReorder from "./BarsReorder"
import type React from "react"
import { BlockPicker, REST_TOKEN, riffToken, SOLO_TOKEN } from "./BlockPicker"
import Input from "@/components/ui/Input"
import InputField from "@/components/ui/InputField"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
  onStopEditing: () => void
}

export function SectionEditor({ state, dispatch, onStopEditing }: Props) {
  return (
    <div className="border border-gray-700 bg-black/20 rounded-md p-3 sm:p-4 shadow-sm">
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
          <p className="text-xs text-zinc-500 mt-1">
            Keep-style name shown as [A]. Leave empty to show the section type.
          </p>
        </div>
      )}

      {state.pendingSection.id !== "" && (
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <BlockPicker
                beatsPerMeasure={state.song.timeSignature.beatsPerMeasure}
                label="Block"
                onSelect={(chordName) =>
                  dispatch({ type: "ADD_BLOCK_TEMPORARY", v: chordName })
                }
                pendingBeats={state.pendingBeats}
                selectedValue={
                  state.pendingBlock
                    ? state.pendingBlock.type === "rest"
                      ? REST_TOKEN
                      : state.pendingBlock.type === "solo"
                        ? SOLO_TOKEN
                        : state.pendingBlock.type === "riff"
                          ? riffToken(state.pendingBlock.label)
                          : state.pendingBlock.chord?.name
                    : undefined
                }
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Select
                name="addBeats"
                label="Beats"
                options={BLOCK_BEAT_VALUES.filter(
                  (v) => v <= state.availableBeats
                )}
                onChange={(e) => {
                  if (e.target.value) {
                    dispatch({ type: "ADD_BEATS", v: e.target.value })
                  }
                }}
                value={state.pendingBeats}
              />
            </div>
          </div>
        </div>
      )}

      {state.pendingSection.id !== "" &&
        state.pendingBlock &&
        state.pendingBeats !== "" &&
        (state.pendingBlock.type === "rest" ||
          state.pendingBlock.type === "riff" ||
          state.pendingBlock.type === "solo" ||
          !!state.pendingBlock.chord?.name) && (
          <div className="mb-4 flex gap-4 mt-4 justify-end">
            <Button
              type="button"
              variant="primary"
              className="min-h-11"
              onClick={() => {
                dispatch({ type: "ADD_BLOCK" })
                const pb = state.pendingBlock
                const label =
                  pb?.type === "rest"
                    ? "Rest"
                    : pb?.type === "solo"
                      ? "Solo"
                      : pb?.type === "riff"
                        ? pb.label?.trim() || "Riff"
                        : (pb?.chord?.name ?? "Block")
                toast.info(`Block ${label} added to pending section`)
              }}
            >
              Add Block
            </Button>
          </div>
        )}

      {state.pendingSection.bars.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-4">Pending Section</h2>

          <div className="mb-4 flex items-center gap-2">
            <SectionTag
              typeName={state.pendingSection.type}
              label={state.pendingSection.label}
            />
            {(state.pendingSection.repeats ?? 1) > 1 && (
              <span className="text-xs font-semibold text-blue-400">
                ×{state.pendingSection.repeats}
              </span>
            )}
          </div>

          <BarsReorder
            section={state.pendingSection as SongSection}
            timeSignature={state.song.timeSignature}
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
          />

          <div className="mb-4 flex flex-wrap gap-3 mt-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={() => {
                dispatch({ type: "CANCEL_SECTION" })
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
