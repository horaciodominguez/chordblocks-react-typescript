import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import Chord from "@/modules/chords/components/Chord"
import { Rest } from "@/modules/chords/components/Rest"
import { chordWidth } from "@/modules/chords/utils/chord.utils"
import type { Block as BlockType } from "@/modules/songs/types/block.types"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import { ArrowLeftRight, Trash } from "lucide-react"
import React, { forwardRef } from "react"

type Props = {
  timeSignature: TimeSignature
  block: BlockType
  dragStyle?: React.CSSProperties
  dragAttributes?: React.HTMLAttributes<HTMLDivElement>
  dragListeners?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
  onDelete?: React.MouseEventHandler<HTMLButtonElement>
  showDiagram?: boolean
}

export const Block = forwardRef<HTMLDivElement, Props>(
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
    ref,
  ) => {
    const width = chordWidth(block.duration, timeSignature.beatsPerMeasure)
    const isRest = !!(block.type === "rest")
    const hasControls = !!(dragStyle || onDelete)

    return (
      <div
        ref={ref}
        className={`BLOCK-WRAP relative group font-bold text-white text-xs ${hasControls ? "py-2 pb-8" : "py-2"}`}
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
            <Chord chord={block.chord?.name} />
          )}

          {showDiagram && <ChordDiagram chordName={block.chord?.name ?? ""} />}
        </div>

        {hasControls && (
          <div
            className="
            flex flex-row justify-center items-center gap-1
            absolute bottom-0 left-1/2 -translate-x-1/2
            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
          >
            <div
              {...dragAttributes}
              {...dragListeners}
              role="button"
              tabIndex={0}
              aria-label="Drag to reorder"
              className="cursor-grab touch-none text-zinc-400 hover:text-zinc-200 p-1.5 min-h-9 min-w-9 flex items-center justify-center"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>

            {onDelete && (
              <button
                className="text-zinc-400 hover:text-zinc-200 p-1.5 min-h-9 min-w-9 flex items-center justify-center"
                type="button"
                onClick={onDelete}
                aria-label="Delete chord"
                title="Delete chord"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    )
  },
)

Block.displayName = "Block"
