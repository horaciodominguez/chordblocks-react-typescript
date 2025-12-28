import InputField from "@/components/ui/InputField"
import Label from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

import { BEAT_VALUES, noteValues } from "@/modules/songs/constants/song"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { Song as SongType } from "@/modules/songs/types/song.types"
import { Calendar, Music, Tag, UserStar } from "lucide-react"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
  song: SongType
}

export function SongFormMeta({ dispatch, state, song }: Props) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      dispatch({
        type: "SET_IMAGE_BASE64",
        v: reader.result as string,
      })
    }

    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="mb-4">
        <InputField
          label="Title"
          name="title"
          onChange={(e) => {
            dispatch({ type: "SET_TITLE", v: e.target.value })
            if (state.errors?.title) {
              dispatch({ type: "CLEAR_ERROR", field: "title" })
            }
          }}
          value={song.title}
          tabIndex={1}
          icon={<Music size={16} />}
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
        )}
      </div>
      <div className="mb-4">
        <div className="flex">
          <div className="w-2/3 mr-2">
            <InputField
              label="Artist"
              name="artist"
              onChange={(e) => {
                dispatch({ type: "SET_ARTIST", v: e.target.value })
                if (state.errors?.artist) {
                  dispatch({ type: "CLEAR_ERROR", field: "artist" })
                }
              }}
              value={song.artist}
              tabIndex={2}
              icon={<UserStar size={16} />}
            />
            {state.errors?.artist && (
              <p className="text-red-500 text-sm mt-1">{state.errors.artist}</p>
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
                  tabIndex={3}
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
                  tabIndex={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex">
          <div className="w-2/3 mr-2">
            <InputField
              label="Genre"
              name="genre"
              onChange={(e) => {
                dispatch({ type: "SET_GENRE", v: e.target.value })
              }}
              value={song.genre}
              tabIndex={5}
              icon={<Tag size={16} />}
            />
          </div>
          <div className="w-1/3 ml-2">
            <InputField
              label="Year"
              name="year"
              type="number"
              onChange={(e) => {
                const value = Number(e.target.value)

                dispatch({
                  type: "SET_YEAR",
                  v: Number.isNaN(value) ? new Date().getFullYear() : value,
                })
              }}
              value={song.year.toString()}
              tabIndex={6}
              icon={<Calendar size={16} />}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-row">
          <div className="">
            {song.imageBase64 ? (
              <img
                src={song.imageBase64}
                alt="Song cover"
                className="w-16 h-16 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center mb-4">
                <Music size={16} className="text-zinc-500" />
              </div>
            )}
          </div>
          <div className="flex-1 ml-4">
            <Label htmlFor="imageUpload">Upload Cover Image</Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="

                w-full text-indigo-300 relative
                file:px-3 file:py-2 file:rounded-md text-sm
                 file:hover:bg-zinc-700/70
                file:mr-2
                file:border file:border-zinc-400/25 file:cursor-pointer 
                file:relative
                file:w-1/3

                after:absolute
                after:top-[0px] after:left-0 after:w-1/3 
                after:h-[1px] after:bg-gradient-to-r after:from-indigo-700/0 
                after:via-green-100/60 after:via-30% after:to-indigo-900/0 after:z-10

                before:absolute 
                before:bottom-[0] before:left-0 before:w-1/3 
                before:h-[1px] before:bg-gradient-to-r before:from-indigo-700/0 
                before:via-zinc-100/60 before:via-70% before:to-indigo-900/0 before:z-11

              "
            />
          </div>
        </div>
      </div>
    </>
  )
}
