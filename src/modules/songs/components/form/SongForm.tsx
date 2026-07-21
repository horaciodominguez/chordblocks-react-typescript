import Button from "@/components/ui/Button"
import { SongFormMeta } from "./SongFormMeta"
import { SongFormPendingSection } from "./SongFormPendingSection"
import { useSongForm } from "../../hooks/useSongForm"

import { type SongParsed } from "../../schemas/song.schema"
import { validateSong } from "../../validation/song.validate"

import { toast } from "sonner"
import type { Song } from "../../types/song.types"
import { StickyActionBar } from "@/components/layout/StickyActionBar"
import { panelFlatClass } from "@/components/ui/Panel"
import { useSongs } from "../../hooks/useSongs"

type Props = {
  handleAddSong: (song: SongParsed) => void
  initialSong?: Song
  onCancel?: () => void
}

export const SongForm = ({
  handleAddSong,
  initialSong,
  onCancel,
}: Props) => {
  const { state, dispatch } = useSongForm(initialSong)
  const { song } = state
  const { mutating } = useSongs()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateSong(song)
    if (result.ok) {
      dispatch({ type: "SET_ERRORS", v: {} })
      handleAddSong(result.data as SongParsed)
      if (!initialSong) dispatch({ type: "RESET" })
      toast.success(`Song "${result.data.title}" saved!`)
    } else {
      dispatch({ type: "SET_ERRORS", v: result.errors })
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 text-white">
      <div className={`flex flex-col gap-4 ${panelFlatClass}`}>
        <SongFormMeta dispatch={dispatch} state={state} song={song} />

        <SongFormPendingSection dispatch={dispatch} state={state} />

        <StickyActionBar>
          {onCancel && (
            <Button
              type="button"
              variant="cancel"
              onClick={onCancel}
              disabled={mutating}
              className="min-h-11"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="save"
            disabled={mutating}
            className="min-h-11 min-w-[7rem] flex items-center justify-center gap-2"
          >
            {mutating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : initialSong ? (
              "Update Song"
            ) : (
              "Add Song"
            )}
          </Button>
        </StickyActionBar>
      </div>
    </form>
  )
}
