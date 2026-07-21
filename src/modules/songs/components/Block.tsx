import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import Chord from "@/modules/chords/components/Chord"
import { Rest } from "@/modules/chords/components/Rest"
import { RiffMarker } from "@/modules/chords/components/RiffMarker"
import { SoloMarker } from "@/modules/chords/components/SoloMarker"
import { chordFlexStyle } from "@/modules/chords/utils/chord.utils"
import type { Block as BlockType } from "@/modules/songs/types/block.types"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import type { SongDensity } from "@/modules/songs/types/density.types"
import { useSongPlayer } from "@/modules/player/hooks/useSongPlayer"
import { BlockRefTimeDialog } from "./form/BlockRefTimeDialog"
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
  onUpdateDuration?: (duration: number) => void
  durationOptions?: readonly number[]
  /** Edit mode: set/edit the YouTube reference time of a riff/solo block. */
  onUpdateRefTime?: (refTime: number | undefined) => void
  /** Edit mode: whether the song has a YouTube link (hint in time dialog). */
  hasYoutubeUrl?: boolean
  showDiagram?: boolean
  density?: SongDensity
}

function BlockContent({
  block,
  timeSignature,
  showDiagram,
  isGuide,
  onSeek,
}: {
  block: BlockType
  timeSignature: TimeSignature
  showDiagram?: boolean
  isGuide: boolean
  onSeek?: () => void
}) {
  if (block.type === "rest") {
    return (
      <Rest
        duration={block.duration}
        beatsPerMeasure={timeSignature.beatsPerMeasure}
      />
    )
  }
  if (block.type === "riff") {
    return <RiffMarker label={block.label} refTime={block.refTime} onSeek={onSeek} />
  }
  if (block.type === "solo") {
    return <SoloMarker refTime={block.refTime} onSeek={onSeek} />
  }
  return (
    <>
      <Chord chord={block.chord?.name} />
      {showDiagram && !isGuide && (
        <ChordDiagram chordName={block.chord?.name ?? ""} />
      )}
    </>
  )
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
      onUpdateDuration,
      durationOptions,
      onUpdateRefTime,
      hasYoutubeUrl,
      showDiagram,
      density = "bars",
    },
    ref,
  ) => {
    const hasControls = !!(dragStyle || onDelete || onUpdateDuration)
    const isGuide = density === "guide"

    const player = useSongPlayer()
    const refTime = block.refTime
    const onSeek =
      !hasControls && player.videoId && refTime !== undefined
        ? () => player.open(refTime)
        : undefined

    const isTimedBlockType = block.type === "riff" || block.type === "solo"

    return (
      <div
        ref={ref}
        className={`relative group box-border flex min-w-0 flex-col items-center justify-center text-xs font-bold text-white light:text-zinc-900 ${
          isGuide ? "min-h-7 px-0.5" : "min-h-10 px-1"
        } ${hasControls ? "min-h-16 py-2 pb-8" : isGuide ? "py-0.5" : "py-2"}`}
        style={{
          ...chordFlexStyle(block.duration),
          visibility: isDragging ? "hidden" : "visible",
          ...(dragStyle ?? {}),
        }}
      >
        <div
          className={`flex flex-col items-center min-w-0 w-full overflow-hidden ${
            isGuide ? "gap-1" : "gap-4"
          }`}
        >
          <BlockContent
            block={block}
            timeSignature={timeSignature}
            showDiagram={showDiagram}
            isGuide={isGuide}
            onSeek={onSeek}
          />
        </div>

        {hasControls && (
          <div
            className="
            flex flex-row justify-center items-center gap-1
            absolute bottom-0 left-1/2 -translate-x-1/2
            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
          >
            {onUpdateDuration && durationOptions && durationOptions.length > 0 && (
              <select
                value={block.duration}
                onChange={(e) =>
                  onUpdateDuration(parseInt(e.target.value, 10))
                }
                aria-label="Block beats"
                title="Beats"
                className="text-xs bg-zinc-800 border border-zinc-600 text-zinc-200 rounded px-1 py-1 min-h-9 cursor-pointer light:bg-white light:border-zinc-300 light:text-zinc-900"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {durationOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}b
                  </option>
                ))}
              </select>
            )}

            {onUpdateRefTime && isTimedBlockType && (
              <BlockRefTimeDialog
                blockLabel={
                  block.type === "riff" ? block.label?.trim() || "Riff" : "Solo"
                }
                refTime={block.refTime}
                hasYoutubeUrl={hasYoutubeUrl}
                onSave={onUpdateRefTime}
              />
            )}

            <div
              {...dragAttributes}
              {...dragListeners}
              role="button"
              tabIndex={0}
              aria-label="Drag to reorder"
              className="cursor-grab touch-none text-zinc-400 hover:text-zinc-200 p-1.5 min-h-9 min-w-9 flex items-center justify-center light:text-zinc-600 light:hover:text-zinc-900"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>

            {onDelete && (
              <button
                className="text-zinc-400 hover:text-zinc-200 p-1.5 min-h-9 min-w-9 flex items-center justify-center light:text-zinc-600 light:hover:text-zinc-900"
                type="button"
                onClick={onDelete}
                aria-label="Delete block"
                title="Delete block"
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
