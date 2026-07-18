import Button from "@/components/ui/Button"

import { useState } from "react"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import { Section } from "@/modules/songs/components/Section"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"

import { toast } from "sonner"
import { SquarePen, Trash2 } from "lucide-react"
import { SectionEditor } from "./SectionEditor"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
}

export function SongFormPendingSection({ dispatch, state }: Props) {
  const [isEditingSection, setIsEditingSection] = useState(false)

  return (
    <>
      {state.song.songSections.length > 0 && (
        <div className="mb-4">
          {state.song.songSections.map((section) => (
            <div key={section.id} className="mb-8">
              <div className="flex gap-2 justify-start items-center mb-4">
                <SectionTag typeName={section.type} />
                {(section.repeats ?? 1) > 1 && (
                  <span className="text-xs font-semibold text-blue-400">
                    ×{section.repeats}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Edit ${section.type} section`}
                  className="flex items-center justify-center min-h-9 min-w-9 rounded-md text-indigo-300 hover:bg-zinc-800/50"
                  onClick={() => {
                    setIsEditingSection(true)
                    dispatch({ type: "EDIT_SECTION", v: section.id })
                    toast.info("Started editing section")
                  }}
                >
                  <SquarePen className="w-4 h-4 cursor-pointer" />
                </button>
                <ConfirmDialog
                  title="Delete section?"
                  description={`Delete the "${section.type}" section? This cannot be undone.`}
                  confirmLabel="Delete"
                  cancelLabel="Cancel"
                  onConfirm={() => {
                    dispatch({ type: "DELETE_SECTION", v: section.id })
                    if (state.editingSectionId === section.id) {
                      setIsEditingSection(false)
                    }
                    toast.success("Section deleted")
                  }}
                  trigger={
                    <button
                      type="button"
                      aria-label={`Delete ${section.type} section`}
                      className="flex items-center justify-center min-h-9 min-w-9 rounded-md text-red-400 hover:bg-zinc-800/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  }
                />
              </div>
              {section.id !== state?.editingSectionId ? (
                <Section
                  section={section}
                  timeSignature={state.song.timeSignature}
                />
              ) : (
                <SectionEditor
                  state={state}
                  dispatch={dispatch}
                  onStopEditing={() => setIsEditingSection(false)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isEditingSection && state.editingSectionId == null ? (
        <SectionEditor
          dispatch={dispatch}
          state={state}
          onStopEditing={() => setIsEditingSection(false)}
        />
      ) : (
        <div className="mb-4">
          <Button
            type="button"
            variant="primary"
            className="min-h-11"
            onClick={() => {
              setIsEditingSection(true)
              toast.info("Started editing new section")
            }}
          >
            Add Section
          </Button>

          {state.errors?.songSections && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.songSections}
            </p>
          )}
        </div>
      )}
    </>
  )
}
