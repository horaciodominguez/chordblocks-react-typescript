
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { BEAT_VALUES, SECTION_OPTIONS } from "../constants/song";


import { chordsData } from "@/modules/chords/data/chords";
import { useState } from "react";
import type { Action, SongFormState } from "../state/songFormReducer";
import { PendingSectionDnd } from "./PendingSectionDnd";
import { Sections } from "./Sections";
import { SectionTag } from "./SectionTag";
import type { SectionType, SongSection } from "../types/section.types";

type Props = {
  dispatch: React.Dispatch<Action>,
  state: SongFormState
} 

export function SongFormPendingSection({ dispatch, state }: Props) {

  const [isEditingSection, setIsEditingSection] = useState(false)

  return (
    <>
      { state.song.songSections.length > 0 && (
          <div className="mb-4">
            {state.song.songSections.map(section => (
              <div key={section.id} className="mb-2">
                <SectionTag typeName={section.type} />
                <Sections section={section} timeSignature={state.song.timeSignature} />
              </div>
            ))}
          </div>
        )
      }

      { isEditingSection ? (

          <div className="border-[.1px] border-gray-700 bg-black/20 rounded-md p-4 shadow-sm">
            <div className="mb-4">
              <Select
                name="sectionType"
                label="Section Type"
                options={SECTION_OPTIONS}
                onChange={(e) => {
                  if (e.target.value) {
                    dispatch({ type: "ADD_SECTION_TYPE", v: e.target.value as SectionType });
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
                    <Select
                      name="addChordName"
                      label="Chord Name"
                      options={Object.keys(chordsData)}
                      onChange={(e) => {
                        if (e.target.value) {
                          dispatch({ type: "ADD_CHORD_NAME", v: e.target.value });
                        }
                      }}
                      value={state.pendingChordName}
                    />
                  </div>
                  <div className="w-1/2">
                    <Select
                      name="addBeats"
                      label="Beats"
                      options={BEAT_VALUES.filter((v) => v <= state.availableBeats)}
                      onChange={(e) => {
                        if (e.target.value) {
                          dispatch({ type: "ADD_BEATS", v: e.target.value });
                        }
                      }}
                      value={state.pendingBeats}
                      />
                  </div>
                </div>
              </div>
            )}

            {state.pendingSection.id !== "" && state.pendingChordName !== "" && state.pendingBeats !== "" && (
              <div className="mb-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    dispatch({ type: "ADD_CHORD" });
                    
                  }}
                >
                  Add Chord
                </Button>
              </div>
            )}

            {state.pendingSection.bars.length > 0 && (
              <div className="mb-4">
                <h2>Pending Section</h2>

                <SectionTag typeName={state.pendingSection.type} />

                <PendingSectionDnd
                  section={state.pendingSection as SongSection}
                  timeSignature={state.song.timeSignature}
                  onReorder={({ barId, newOrderIds }) => {
                    dispatch({ type: "REORDER_CHORDS_IN_BAR", barId, order: newOrderIds })
                  }}
                  renderChord={(id) => (
                    <button
                      type="button"
                      className="ml-1 text-red-500 hover:text-red-700"
                      onClick={() => dispatch({ type: "DELETE_CHORD", v: id })}
                      aria-label="Delete chord"
                      title="Delete chord"
                    >
                      &times;
                    </button>
                  )}
                />

                <div className="mb-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={
                      () => (dispatch({ type: "FINALIZE_SECTION" }), setIsEditingSection(false))
                    }
                  >
                    Finalize Section
                  </Button>
                </div>
              </div>
            )}
          </div>

        ) : (
          <div className="mb-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditingSection(true)}
            >
              Add Section
            </Button>
          </div>
        )
      }

      
    </>
  )
}