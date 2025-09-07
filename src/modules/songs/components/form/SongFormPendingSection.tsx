import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { BEAT_VALUES, SECTION_OPTIONS } from "@/modules/songs/constants/song"

import { useState } from "react"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { SectionType } from "@/modules/songs/types/section.types"
import { Sections } from "@/modules/songs/components/Sections"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"

import { ChordPicker } from "@/modules/chords/components/ChordPicker"
import { toast } from "sonner"
import BarsReorder from "@/modules/songs/components/form/BarsReorder"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
}

export function SongFormPendingSection({ dispatch, state }: Props) {
  const [isEditingSection, setIsEditingSection] = useState(false)

  return (
    <>
      {state.song.songSections.length > 0 && (
        <div className="mb-4">
          {state.song.songSections.map((section) => (
            <div key={section.id} className="mb-2">
              <SectionTag typeName={section.type} />
              <Sections
                section={section}
                timeSignature={state.song.timeSignature}
              />
            </div>
          ))}
        </div>
      )}

      {isEditingSection ? (
        <div className="border-[.1px] border-gray-700 bg-black/20 rounded-md p-4 shadow-sm">
          <div className="mb-4">
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
          {state.pendingSection.id !== "" && (
            <div className="mb-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <ChordPicker
                    label="Chord"
                    onSelect={(chordName) =>
                      dispatch({ type: "ADD_CHORD_NAME", v: chordName })
                    }
                    selectedValue={state.pendingChordName}
                  />
                </div>
                <div className="w-1/2">
                  <Select
                    name="addBeats"
                    label="Beats"
                    options={BEAT_VALUES.filter(
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
            state.pendingChordName !== "" &&
            state.pendingBeats !== "" && (
              <div className="mb-4 flex gap-4 mt-4 justify-end">
                <div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      dispatch({ type: "ADD_CHORD" })
                      toast.info(
                        `Chord ${state.pendingChordName} added to pending section`
                      )
                    }}
                  >
                    Add Chord
                  </Button>
                </div>
              </div>
            )}

          {state.pendingSection.bars.length > 0 && (
            <div className="mb-4">
              <h2>Pending Section</h2>

              <SectionTag typeName={state.pendingSection.type} />

              <BarsReorder
                sectionId={state.pendingSection.id}
                bars={state.pendingSection.bars}
                timeSignature={state.song.timeSignature}
                onReorder={(newBars) =>
                  dispatch({
                    type: "REORDER_BARS_IN_SECTION",
                    sectionId: state.pendingSection.id,
                    order: newBars.map((b) => b.id),
                  })
                }
                onReorderChords={(barId, newChords) =>
                  dispatch({
                    type: "REORDER_CHORDS_IN_BAR",
                    barId,
                    order: newChords.map((c) => c.id),
                  })
                }
                chordActions={(id) => (
                  <button
                    type="button"
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => {
                      dispatch({ type: "DELETE_CHORD", v: id })
                      toast.info("Chord deleted")
                    }}
                    aria-label="Delete chord"
                    title="Delete chord"
                  >
                    ❌
                  </button>
                )}
              />

              <div className="mb-4 flex gap-4 mt-4 justify-end">
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => (
                      dispatch({ type: "CANCEL_SECTION" }),
                      setIsEditingSection(false)
                    )}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => (
                      dispatch({ type: "FINALIZE_SECTION" }),
                      setIsEditingSection(false),
                      state.errors?.songSections &&
                        dispatch({
                          type: "CLEAR_ERROR",
                          field: "songSections",
                        }),
                      toast.info(
                        `Section ${state.pendingSection.type} added to song`
                      )
                    )}
                  >
                    Complete Section
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setIsEditingSection(true)
              toast.info("Started editing new section")
            }}
          >
            Add Section
          </Button>

          {state.errors?.songSections && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.songSections}
            </p>
          )}
        </div>
      )}
    </>
  )
}
