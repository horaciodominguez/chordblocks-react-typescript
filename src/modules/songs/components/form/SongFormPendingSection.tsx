import Button from "@/components/ui/Button"

import { useEffect, useState } from "react"
import type {
  Action,
  SongFormState,
} from "@/modules/songs/state/songFormReducer"
import { Section } from "@/modules/songs/components/Section"
import { SectionTag } from "@/modules/songs/components/ui/SectionTag"

import { toast } from "sonner"
import { Copy, SquarePen, Trash2 } from "lucide-react"
import { SectionEditor } from "./SectionEditor"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import SectionsReorder from "./SectionsReorder"

type Props = {
  dispatch: React.Dispatch<Action>
  state: SongFormState
}

export function SongFormPendingSection({ dispatch, state }: Props) {
  const [isEditingSection, setIsEditingSection] = useState(false)
  const [editingHighlightId, setEditingHighlightId] = useState<string>()
  const sectionReorderDisabled = isEditingSection
  const duplicatedSectionId = state.duplicatedSectionId
  const highlightedSectionId = duplicatedSectionId ?? editingHighlightId

  useEffect(() => {
    if (!highlightedSectionId) return

    document
      .getElementById(`song-section-${highlightedSectionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [highlightedSectionId])

  return (
    <>
      {state.song.songSections.length > 0 && (
        <div className="mb-4">
          <SectionsReorder
            sections={state.song.songSections}
            disabled={sectionReorderDisabled}
            highlightedSectionId={highlightedSectionId}
            onReorder={(order) =>
              dispatch({ type: "REORDER_SECTIONS", order })
            }
            onHighlightEnd={() => {
              setEditingHighlightId(undefined)
              dispatch({ type: "CLEAR_DUPLICATED_SECTION" })
            }}
          >
            {(section) => (
              <>
                <div className="flex gap-2 justify-start items-center mb-4">
                  <SectionTag typeName={section.type} label={section.label} />
                  {(section.repeats ?? 1) > 1 && (
                    <span className="text-xs font-semibold text-blue-400 light:text-blue-600">
                      ×{section.repeats}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Edit ${section.type} section`}
                    className="flex items-center justify-center min-h-9 min-w-9 cursor-pointer rounded-md text-indigo-300 hover:bg-zinc-800/50 light:text-indigo-700 light:hover:bg-zinc-100"
                    onClick={() => {
                      setIsEditingSection(true)
                      setEditingHighlightId(section.id)
                      dispatch({ type: "EDIT_SECTION", v: section.id })
                      toast.info("Started editing section")
                    }}
                  >
                    <SquarePen className="w-4 h-4 cursor-pointer" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Duplicate ${section.type} section`}
                    className="flex items-center justify-center min-h-9 min-w-9 cursor-pointer rounded-md text-indigo-300 hover:bg-zinc-800/50 light:text-indigo-700 light:hover:bg-zinc-100"
                    onClick={() => {
                      dispatch({ type: "DUPLICATE_SECTION", v: section.id })
                      toast.success("Section duplicated")
                    }}
                  >
                    <Copy className="w-4 h-4" />
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
                        className="flex items-center justify-center min-h-9 min-w-9 cursor-pointer rounded-md text-red-400 hover:bg-zinc-800/50 light:text-red-600 light:hover:bg-zinc-100"
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
              </>
            )}
          </SectionsReorder>
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
