


import Input from "@/components/ui/Input"
import { beatsPerMeasureValues, noteValues, SECTION_OPTIONS, type SectionType, type SongSection, type Song as SongType } from "../types/song.types"

import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"

import { useSongBuilder } from "../hooks/useSongBuilder"
import { chordsData } from "@/modules/chords/data/chords"
import { Song } from "./Song"
import { SectionTag } from "./SectionTag"
import { Sections } from "./Sections"

import { PendingSectionDnd } from "./PendingSectionDnd"

type Props = {
  handleAddSong: (song: SongType) => void
};

export const SongForm2 = ({ handleAddSong }: Props) => {
  const { state, dispatch } = useSongBuilder()
  const { song } = state

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleAddSong(song)
    }}>
      <div className="flex flex-col gap-4">
          <div className="mb-4">
            <Input
              label="Title"
              name="title"
              onChange={(e) => dispatch({ type: "SET_TITLE", v: e.target.value })}
              value={song.title}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Author"
              name="author"
              onChange={(e) => dispatch({ type: "SET_AUTHOR", v: e.target.value })}
              value={song.author}
            />
          </div>
          <div className="mb-4">
            <div className="flex gap-4">
                <div className="w-1/2">
                  <Select
                    name="beatsPerMeasure"
                    label="Beats Per Measure"
                    options={beatsPerMeasureValues}
                    onChange={(e) => {
                      dispatch({ type: "SET_TIME_SIGNATURE", v: { ...song.timeSignature, beatsPerMeasure: parseInt(e.target.value) } });
                    }}
                    value={song.timeSignature.beatsPerMeasure.toString()} />
                </div>
                <div className="w-1/2">
                  <Select
                    name="noteValue"
                    label="Note Value"
                    options={noteValues}
                    onChange={(e) => {
                      dispatch({ type: "SET_TIME_SIGNATURE", v: { ...song.timeSignature, noteValue: parseInt(e.target.value) } });
                    }}
                    value={song.timeSignature.noteValue.toString()} />
                </div>
            </div>
          </div>
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

          {state.pendingSection.bars.length > 0 && (

            <div className="mb-4">
              <h2>Pending Section</h2>
              <SectionTag typeName={state.pendingSection.type} />
              <Sections 
                section={state.pendingSection as SongSection} 
                timeSignature={song.timeSignature}
                renderChord={(id) => (
                  <button
                    type="button"
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => dispatch({ type: "DELETE_CHORD", v: id })}
                  >
                    &times;
                  </button>
                )}
              />

              <div className="mb-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      dispatch({ type: "FINALIZE_SECTION" });
                    }}
                  >
                    Finalize Section
                  </Button>
              </div>
            </div>
          )}

          {state.song.songSections.length > 0 && 
            <>
                <h2>Temporary Song</h2>
                <Song song={song} />
            </>
          }
          
          <div className="mb-4">
            <Button 
              type="submit"
              variant="primary"
            >Add Song</Button>
          </div>
      </div>
    </form>
  )
}

