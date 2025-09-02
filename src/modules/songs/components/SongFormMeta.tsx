import InputInline from "@/components/ui/InputInline"
import { Select } from "@/components/ui/Select"
import { BEAT_VALUES, noteValues } from "../constants/song"
import type { Action, SongFormState } from "../state/songFormReducer"
import type { Song as SongType } from "../types/song.types"
import type { SongParsed } from "../schemas/song.schema"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
  song: SongType
  errorTitle?: string
  errorArtist?: string
  clearError: (field: keyof SongParsed) => void
}

export function SongFormMeta({
  dispatch,
  state,
  song,
  errorTitle,
  errorArtist,
  clearError,
}: Props) {
  return (
    <>
      <div className="mb-4">
        <InputInline
          label="Title"
          name="title"
          onChange={(e) => dispatch({ type: "SET_TITLE", v: e.target.value })}
          onValid={() => clearError("title")}
          value={song.title}
        />
        {errorTitle && (
          <p className="text-red-500 text-sm mt-1">{errorTitle}</p>
        )}
      </div>
      <div className="mb-4">
        <div className="flex">
          <div className="w-2/3 mr-2">
            <InputInline
              label="Artist"
              name="artist"
              onChange={(e) =>
                dispatch({ type: "SET_ARTIST", v: e.target.value })
              }
              onValid={() => clearError("artist")}
              value={song.artist}
            />
            {errorArtist && (
              <p className="text-red-500 text-sm mt-1">{errorArtist}</p>
            )}
          </div>
          <div className="w-1/3 ml-2">
            <div className="flex gap-4">
              <div className="w-1/2">
                <Select
                  name="beatsPerMeasure"
                  label="Beats"
                  options={BEAT_VALUES}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_TIME_SIGNATURE",
                      v: {
                        ...song.timeSignature,
                        beatsPerMeasure: parseInt(e.target.value),
                      },
                    })
                  }}
                  value={song.timeSignature.beatsPerMeasure.toString()}
                  disabled={
                    state.song.songSections.length > 0 ||
                    state.pendingSection.id !== ""
                  }
                  disabledMessage="Cannot change time signature after adding sections. Delete sections to change."
                />
              </div>
              <div className="w-1/2">
                <Select
                  name="noteValue"
                  label="Note"
                  options={noteValues}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_TIME_SIGNATURE",
                      v: {
                        ...song.timeSignature,
                        noteValue: parseInt(e.target.value),
                      },
                    })
                  }}
                  value={song.timeSignature.noteValue.toString()}
                  disabled={
                    state.song.songSections.length > 0 ||
                    state.pendingSection.id !== ""
                  }
                  disabledMessage="Cannot change time signature after adding sections. Delete sections to change."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
