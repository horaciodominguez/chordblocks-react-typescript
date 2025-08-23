


import Input from "@/components/ui/Input"
import { beatsPerMeasureValues, noteValues, SECTION_OPTIONS, type SectionType, type Song } from "../types/song.types"

import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"

import { useSongBuilder } from "../hooks/useSongBuilder"



type Props = {
  handleAddSong: (song: Song) => void
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
              defaultValue=""
            />
          </div>
          
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

