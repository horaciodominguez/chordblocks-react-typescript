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
import { songWithPendingSectionFlushed } from "@/modules/songs/utils/songWithPendingSectionFlushed"
import { parseCueTimeInput } from "@/modules/songs/utils/scrollSync"
import type { SongFormState } from "@/modules/songs/state/songFormReducer"

type Props = {
  handleAddSong: (song: SongParsed) => void
  initialSong?: Song
  onCancel?: () => void
}

/** Pull Sync time from the open section field (may not have blurred yet). */
function withCueFromDom(state: SongFormState): SongFormState {
  if (!state.pendingSection.id) return state
  const cueInput = document.querySelector<HTMLInputElement>(
    'input[name="sectionCueTime"]',
  )
  if (!cueInput) return state
  const raw = cueInput.value.trim()
  if (raw === "") {
    if (state.pendingSection.cueTime === undefined) return state
    const { cueTime: _, ...rest } = state.pendingSection
    return { ...state, pendingSection: { ...rest } }
  }
  const parsed = parseCueTimeInput(raw)
  if (parsed === undefined) return state
  if (state.pendingSection.cueTime === parsed) return state
  return {
    ...state,
    pendingSection: { ...state.pendingSection, cueTime: parsed },
  }
}

export const SongForm = ({ handleAddSong, initialSong, onCancel }: Props) => {
  const { state, dispatch } = useSongForm(initialSong)
  const { mutating } = useSongs()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const stateForSave = withCueFromDom(state)
    const flushed = songWithPendingSectionFlushed(stateForSave)
    if (flushed.error) {
      toast.error(flushed.error)
      return
    }

    const result = validateSong(flushed.song)
    if (!result.ok) {
      dispatch({ type: "SET_ERRORS", v: result.errors })
      const first = Object.values(result.errors)[0]
      toast.error(first ?? "Could not save — check the form fields")
      return
    }

    // Persist open section (incl. Sync time) into form state, then save.
    if (flushed.didFlush) {
      dispatch({
        type: "SET_PENDING_SECTION_CUE_TIME",
        v: stateForSave.pendingSection.cueTime,
      })
      dispatch({
        type: state.editingSectionId ? "UPDATE_SECTION" : "FINALIZE_SECTION",
      })
    }

    dispatch({ type: "SET_ERRORS", v: {} })
    handleAddSong(result.data as SongParsed)
    if (!initialSong) dispatch({ type: "RESET" })
    toast.success(`Song "${result.data.title}" saved!`)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 text-white">
      <div className={`flex flex-col gap-4 ${panelFlatClass}`}>
        <SongFormMeta dispatch={dispatch} state={state} song={state.song} />

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
