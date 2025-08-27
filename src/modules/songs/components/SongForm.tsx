import Button from "@/components/ui/Button"
import { useSongForm } from "../hooks/useSongForm"
import { type Song as SongType } from "../types/song.types"
import { SongFormMeta } from "./SongFormMeta"
import { SongFormPendingSection } from "./SongFormPendingSection"

type Props = {
  handleAddSong: (song: SongType) => void
};

export const SongForm = ({ handleAddSong }: Props) => {

  const { state, dispatch } = useSongForm()
  const { song } = state

  return (

    <form onSubmit={(e) => {
      e.preventDefault()
      handleAddSong(song)
    }}>

    <div className="flex flex-col gap-4">
            
      <SongFormMeta dispatch={dispatch} state={state} song={song} />

      <SongFormPendingSection dispatch={dispatch} state={state} />

      <div className="mb-4 justify-end flex">
        <Button 
          type="submit"
          variant="save"
        >Create Song</Button>
      </div>

      </div>

    </form>
  )
}

