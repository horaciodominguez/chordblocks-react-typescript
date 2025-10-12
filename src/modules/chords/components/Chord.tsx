import React, { forwardRef } from "react"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import type { Block } from "@/modules/songs/types/block.types"
import { chordWidth } from "@/modules/chords/utils/chord.utils"
import { ArrowLeftRight, Trash } from "lucide-react"
import Rest from "./Rest"
import ChordDisplay from "./ChordDisplay"

type Props = {
  timeSignature: TimeSignature
  block: Block
  dragStyle?: React.CSSProperties
  dragAttributes?: React.HTMLAttributes<HTMLDivElement>
  dragListeners?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
  onDelete?: React.MouseEventHandler<HTMLButtonElement>
  showDiagram?: boolean
}

export const Chord = forwardRef<HTMLDivElement, Props>(
  (
    {
      timeSignature,
      block,
      dragStyle,
      dragAttributes,
      dragListeners,
      isDragging,
      onDelete,
      showDiagram,
    },
    ref
  ) => {
    const width = chordWidth(block.duration, timeSignature.beatsPerMeasure)

    const isRest = !!(block.type === "rest")

    return (
      <div
        ref={ref}
        className="CHORD-WRAP-COMPONENT relative group py-2 font-bold text-white text-xs"
        style={{
          width,
          visibility: isDragging ? "hidden" : "visible",
          ...(dragStyle ?? {}),
        }}
      >
        <div className="flex flex-col gap-4 items-center justify-center">
          {isRest ? (
            <Rest
              duration={block.duration}
              beatsPerMeasure={timeSignature.beatsPerMeasure}
            />
          ) : (
            <ChordDisplay chord={block.chord} />
          )}

          {showDiagram && (
            <picture>
              <svg
                className="w-8 h-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <use
                  href={`/assets/chords-sprite.svg#${block.chord?.name}`}
                  className="text-white"
                  fill="currentColor"
                  width={32}
                  height={40}
                />
              </svg>
            </picture>
          )}
        </div>

        {(dragStyle || onDelete) && (
          <div
            className="
            flex flex-row
            justify-center
            items-center
            absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition"
          >
            <div
              {...dragAttributes}
              {...dragListeners}
              className="cursor-grab text-zinc-400 hover:text-zinc-200"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>

            <button
              className="text-zinc-400 hover:text-zinc-200"
              type="button"
              onClick={onDelete}
              aria-label="Delete chord"
              title="Delete chord"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    )
  }
)

Chord.displayName = "Chord"
