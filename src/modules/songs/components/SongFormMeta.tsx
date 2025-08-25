import Input from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import type { Song as SongType } from "../types/song.types"


import { BEAT_VALUES, noteValues } from "../constants/song"

import type { Action } from "../state/songFormReducer"

type Props = {
  dispatch: React.Dispatch<Action>,
  song: SongType
} 

export function SongFormMeta({ dispatch, song }: Props) {
  return (
    <>
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
                options={BEAT_VALUES}
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
    </>
  )
}