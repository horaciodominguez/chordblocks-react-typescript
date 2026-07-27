import Button from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import Chord from "@/modules/chords/components/Chord"
import ChordDiagram from "@/modules/chords/components/ChordDiagram"
import Rest from "@/modules/chords/components/Rest"
import { RiffMarker } from "@/modules/chords/components/RiffMarker"
import { SoloMarker } from "@/modules/chords/components/SoloMarker"
import { FeelMarker } from "@/modules/chords/components/FeelMarker"
import { chordFlexStyle } from "@/modules/chords/utils/chord.utils"
import { isFeelMarkerId } from "@/modules/songs/constants/feel"
import type { Block } from "@/modules/songs/types/block.types"
import type { TimeSignature } from "@/modules/songs/types/song.types"
import { Check, X } from "lucide-react"

type Props = {
  block: Block
  timeSignature: TimeSignature
  pendingBeats: string
  beatOptions: number[]
  /** Flex share — remaining beats in bar, or full measure when below. */
  slotBeats: number
  onBeatsChange: (beats: string) => void
  onConfirm: () => void
  onCancel: () => void
}

function DraftPreview({
  block,
  timeSignature,
  pendingBeats,
}: {
  block: Block
  timeSignature: TimeSignature
  pendingBeats: string
}) {
  const duration = Math.max(1, parseInt(pendingBeats, 10) || 1)

  if (block.type === "rest") {
    return (
      <Rest
        duration={duration}
        beatsPerMeasure={timeSignature.beatsPerMeasure}
      />
    )
  }
  if (block.type === "riff") {
    return <RiffMarker label={block.label} />
  }
  if (block.type === "solo") {
    return <SoloMarker />
  }
  if (block.type === "feel" && block.label && isFeelMarkerId(block.label)) {
    return <FeelMarker feelId={block.label} />
  }
  const chordName = block.chord?.name ?? ""
  const voicing = block.chord?.voicing ?? 0
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Chord chord={chordName} />
      <ChordDiagram chordName={chordName} voicing={voicing} />
    </div>
  )
}

/** Inline draft after picker: preview + beats + confirm/cancel. */
export function DraftBlockInsert({
  block,
  timeSignature,
  pendingBeats,
  beatOptions,
  slotBeats,
  onBeatsChange,
  onConfirm,
  onCancel,
}: Props) {
  const canConfirm =
    pendingBeats !== "" &&
    beatOptions.length > 0 &&
    (block.type === "rest" ||
      block.type === "riff" ||
      block.type === "solo" ||
      block.type === "feel" ||
      !!block.chord?.name)

  return (
    <div
      role="group"
      aria-label="Confirm new block"
      style={chordFlexStyle(Math.max(1, slotBeats))}
      className="box-border flex min-h-0 min-w-0 flex-col self-stretch"
    >
      <div
        className="
          box-border flex w-full flex-1 flex-wrap
          items-center justify-center gap-2
          p-2 rounded-md
          border border-dashed border-zinc-400/60
          bg-transparent
          light:border-zinc-400/70
        "
      >
      <div className="flex items-center justify-center min-h-11 min-w-11 px-1">
        <DraftPreview
          block={block}
          timeSignature={timeSignature}
          pendingBeats={pendingBeats}
        />
      </div>

      <div className="w-20">
        <Select
          name="draftBeats"
          label="Beats"
          options={beatOptions}
          value={pendingBeats}
          onChange={(e) => {
            if (e.target.value) onBeatsChange(e.target.value)
          }}
        />
      </div>

      <div className="flex items-center gap-1 pb-0.5">
        <Button
          type="button"
          variant="primary"
          className="min-h-11 min-w-11 px-2"
          aria-label="Confirm block"
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          <Check className="w-5 h-5" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11 min-w-11 px-2"
          aria-label="Cancel draft"
          onClick={onCancel}
        >
          <X className="w-5 h-5" aria-hidden />
        </Button>
      </div>
      </div>
    </div>
  )
}
