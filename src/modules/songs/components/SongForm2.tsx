


import Input from "@/components/ui/Input"
import { beatsPerMeasureValues, noteValues, SECTION_OPTIONS, type SectionType, type Song as SongType } from "../types/song.types"

import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"

import { useSongBuilder } from "../hooks/useSongBuilder"
import { chordsData } from "@/modules/chords/data/chords"
import { Song } from "./Song"



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
              <div className="border border-gray-300 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Pending Section: {state.pendingSection.type}</h3>
                {state.pendingSection.bars.map((bar, barIndex) => (
                  <div key={bar.id} className="mb-2">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold mr-2">Bar {barIndex + 1}:</span>
                      {bar.chords.map((chord) => (
                        <div key={chord.id} className="flex items-center mr-2">
                          <span>{chord.name} ({chord.duration})</span>
                          <button
                            type="button"
                            className="ml-1 text-red-500 hover:text-red-700"
                            onClick={() => dispatch({ type: "DELETE_CHORD", v: chord.id })}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
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

