import Button from "@/components/ui/Button"
import { SongFormMeta } from "./SongFormMeta"
import { SongFormPendingSection } from "./SongFormPendingSection"
import { useSongForm } from "../hooks/useSongForm"

import { type SongParsed, SongSchema } from "../schemas/song.schema"
import { validateSong } from "../validation/song.validate"
import { useState } from "react"

type Props = {
  handleAddSong: (song: SongParsed) => void
}

export const SongForm = ({ handleAddSong }: Props) => {
  const { state, dispatch } = useSongForm()
  const { song } = state

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof SongParsed, string>>
  >({})

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateSong(song)
    if (result.ok) {
      setFormErrors({})
      handleAddSong(result.data)
    } else {
      setFormErrors(result.errors)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 text-white">
      <div className="flex flex-col gap-4">
        <SongFormMeta
          dispatch={dispatch}
          state={state}
          song={song}
          errorTitle={formErrors["title"]}
          errorArtist={formErrors["artist"]}
        />

        <SongFormPendingSection
          dispatch={dispatch}
          state={state}
          errorSection={formErrors["songSections"]}
        />

        <div className="mb-4 justify-end flex">
          <Button type="submit" variant="save">
            Create Song
          </Button>
        </div>
      </div>
    </form>
  )
}
