import InputField from "@/components/ui/InputField"
import Label from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

import {
  BEAT_VALUES,
  MAIN_KEY_OPTIONS,
  noteValues,
} from "@/modules/songs/constants/song"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import type { Song as SongType } from "@/modules/songs/types/song.types"
import { Calendar, Music, Tag, UserStar } from "lucide-react"
import { SongFormBakeTranspose } from "./SongFormBakeTranspose"

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

  const timeSigDisabled =
    state.song.songSections.length > 0 || state.pendingSection.id !== ""

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

      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <div className="w-full md:flex-1">
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
        <div className="w-full md:w-auto flex gap-3">
          <div className="flex-1 md:w-24">
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
              disabled={timeSigDisabled}
              disabledMessage="Cannot change time signature after adding sections. Delete sections to change."
              tabIndex={3}
            />
          </div>
          <div className="flex-1 md:w-24">
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
              disabled={timeSigDisabled}
              disabledMessage="Cannot change time signature after adding sections. Delete sections to change."
              tabIndex={4}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:flex-1">
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
        <div className="w-full sm:w-28">
          <Select
            name="mainKey"
            label="Key"
            options={MAIN_KEY_OPTIONS}
            defaultValue="—"
            value={song.mainKey ?? ""}
            onChange={(e) => {
              dispatch({
                type: "SET_MAIN_KEY",
                v: e.target.value || undefined,
              })
            }}
            tabIndex={6}
          />
        </div>
        <div className="w-full sm:w-32">
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
            tabIndex={7}
            icon={<Calendar size={16} />}
          />
        </div>
      </div>

      <SongFormBakeTranspose dispatch={dispatch} song={song} />

      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="shrink-0">
            {song.imageBase64 || song.imageUrl ? (
              <img
                src={song.imageBase64 ?? song.imageUrl!}
                alt="Song cover"
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-zinc-800 rounded flex items-center justify-center">
                <Music size={24} className="text-zinc-500" />
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <Label htmlFor="imageUpload">Upload Cover Image</Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="
                w-full text-indigo-300 relative mt-1
                file:px-3 file:py-2 file:rounded-md text-sm
                file:hover:bg-zinc-700/70
                file:mr-2
                file:border file:border-zinc-400/25 file:cursor-pointer
                file:bg-zinc-800 file:text-indigo-300
              "
            />
            <p className="text-xs text-zinc-500 mt-2">
              By uploading an image, you confirm you own the rights to it or
              have permission to use it.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
