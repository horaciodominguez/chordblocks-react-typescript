import Button from "@/components/ui/Button"

import { useState } from "react"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import { Section } from "@/modules/songs/components/Section"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"

import { toast } from "sonner"
import { SquarePen } from "lucide-react"
import { SectionEditor } from "./SectionEditor"

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
            <div key={section.id} className="mb-2">
              <div className="flex gap-2 justify-start items-center">
                <SectionTag typeName={section.type} />
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSection(true)
                    dispatch({ type: "EDIT_SECTION", v: section.id })
                    toast.info("Started editing section")
                  }}
                >
                  <SquarePen className="w-4 h-4 cursor-pointer" />
                </button>
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
