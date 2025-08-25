
import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { beatsPerMeasureValues, SECTION_OPTIONS } from "../constants/song";
import { type SectionType, type SongSection, type Song as SongType } from "../types/song.types"

import { chordsData } from "@/modules/chords/data/chords";
import { SectionTag } from "./SectionTag";
import { PendingSectionDnd } from "./PendingSectionDnd";

type Props = {
  dispatch: React.Dispatch<any>,
  state: {
    song: SongType,
    pendingSection: SongSection,
    pendingChordName: string,
    pendingBeats: string,
    availableBeats: number
  }
} 

export function SongFormPendingSection({ dispatch, state }: Props) {
  return (
    <>
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
                options={beatsPerMeasureValues.filter((v) => v <= state.availableBeats)}
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
              onClick={() => dispatch({ type: "FINALIZE_SECTION" })}
            >
              Finalize Section
            </Button>
          </div>
        </div>
      )}
    </>
  )
}