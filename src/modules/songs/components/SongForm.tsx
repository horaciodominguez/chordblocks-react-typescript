import Button from "@/components/ui/Button"
import { useSongForm } from "../hooks/useSongForm"
import type { Song as SongType } from "../types/song.types"
import { SongFormMeta } from "./SongFormMeta"
import { SongFormPendingSection } from "./SongFormPendingSection"

import { useActionState } from "react"
import {
  validateSong,
  type ValidationErrorMap,
} from "../validation/song.validate"

type Props = {
  handleAddSong: (song: SongType) => void
}

type FormState = { ok: boolean; errors: ValidationErrorMap }

export const SongForm = ({ handleAddSong }: Props) => {
  const { state, dispatch } = useSongForm()
  const { song } = state

  const [formState, formAction, isPending] = useActionState(
    async () => {
      const validation = validateSong(song)

      if (!validation.ok) {
        return { ok: false, errors: validation.errors }
      }

      handleAddSong(validation.data)
      dispatch({ type: "RESET" })
      return { ok: true, errors: {} }
    },

    { ok: false, errors: {} } as FormState
  )

  return (
    <form action={formAction} className="flex flex-col gap-2 text-white">
      <div className="flex flex-col gap-4">
        <SongFormMeta
          dispatch={dispatch}
          state={state}
          song={song}
          error={formState?.errors}
        />

        <SongFormPendingSection dispatch={dispatch} state={state} />

        <div className="mb-4 justify-end flex">
          <Button type="submit" variant="save" disabled={isPending}>
            {isPending ? "Saving..." : "Create Song"}
          </Button>
        </div>
      </div>
    </form>
  )
}
