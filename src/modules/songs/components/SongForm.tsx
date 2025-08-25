


import Button from "@/components/ui/Button"

import { type Song as SongType } from "../types/song.types"

import { Song } from "./Song"
import { useSongForm } from "../hooks/useSongForm"
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
            
      <SongFormMeta dispatch={dispatch} song={song} />

      <SongFormPendingSection dispatch={dispatch} state={state} />

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

