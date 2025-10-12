import { Select } from "@/components/ui/Select"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import { BEAT_VALUES, SECTION_OPTIONS } from "@/modules/songs/constants/song"
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
import Input from "@/components/ui/Input"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
  onStopEditing: () => void
}

export function SectionEditor({ state, dispatch, onStopEditing }: Props) {
  return (
    <div className="border-[.1px] border-gray-700 bg-black/20 rounded-md p-4 shadow-sm">
      <div className="mb-4 flex flex-row gap-4">
        <div className="w-1/2">
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
            defaultValue=""
          />
        </div>
        <div className="w-1/2 flex justify-end items-end">
          {state.pendingSection.id !== "" && (
            <div className="flex justify-start items-center gap-4">
              <label className="flex justify-center items-center gap-4">
                <input
                  type="checkbox"
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
          <div className="flex gap-4">
            <div className="w-1/2">
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
                      ? "__REST__"
                      : state.pendingBlock.chord?.name
                    : undefined
                }
              />
            </div>
            <div className="w-1/2">
              <Select
                name="addBeats"
                label="Beats"
                options={BEAT_VALUES.filter((v) => v <= state.availableBeats)}
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
          !!state.pendingBlock.chord?.name) && (
          <div className="mb-4 flex gap-4 mt-4 justify-end">
            <div>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  dispatch({ type: "ADD_BLOCK" })
                  const label =
                    state.pendingBlock?.type === "rest"
                      ? "Rest"
                      : state.pendingBlock?.chord?.name ?? "Block"
                  toast.info(`Block ${label} added to pending section`)
                }}
              >
                Add Block
              </Button>
            </div>
          </div>
        )}

      {state.pendingSection.bars.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-4">Pending Section</h2>

          <div className="mb-4">
            <SectionTag typeName={state.pendingSection.type} />
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
          />

          <div className="mb-4 flex gap-4 mt-4 justify-end">
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => (
                  dispatch({ type: "CANCEL_SECTION" }), onStopEditing()
                )}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="primary"
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
        </div>
      )}
    </div>
  )
}
