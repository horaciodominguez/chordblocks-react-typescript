import Button from "@/components/ui/Button"
import { SongFormMeta } from "./SongFormMeta"
import { SongFormPendingSection } from "./SongFormPendingSection"
import { useSongForm } from "../hooks/useSongForm"

import { type SongParsed } from "../schemas/song.schema"
import { validateSong } from "../validation/song.validate"

import { toast } from "sonner"

type Props = {
  handleAddSong: (song: SongParsed) => void
  initialSong?: SongParsed
}

export const SongForm = ({ handleAddSong, initialSong }: Props) => {
  const { state, dispatch } = useSongForm(initialSong)
  const { song } = state

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateSong(song)
    if (result.ok) {
      dispatch({ type: "SET_ERRORS", v: {} })
      handleAddSong(result.data)
      if (!initialSong) dispatch({ type: "RESET" })
      toast.success(`Song "${result.data.title}" saved!`)
    } else {
      dispatch({ type: "SET_ERRORS", v: result.errors })
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 text-white">
      <div className="flex flex-col gap-4">
        <SongFormMeta dispatch={dispatch} state={state} song={song} />

        <SongFormPendingSection dispatch={dispatch} state={state} />

        <div className="mb-4 justify-end flex">
          <Button type="submit" variant="save">
            Create Song
          </Button>
        </div>
      </div>
    </form>
  )
}
