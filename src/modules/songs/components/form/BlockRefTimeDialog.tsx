import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Clock } from "lucide-react"
import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import {
  formatSeconds,
  parseTimeToSeconds,
} from "@/modules/songs/utils/youtube"

type Props = {
  /** "Riff 1" / "Solo" — used in the dialog title. */
  blockLabel: string
  refTime?: number
  hasYoutubeUrl?: boolean
  onSave: (refTime: number | undefined) => void
}

/**
 * Edit-mode control to set where a riff/solo is heard in the song's
 * YouTube reference. Renders a clock button that opens a small dialog.
 */
export function BlockRefTimeDialog({
  blockLabel,
  refTime,
  hasYoutubeUrl = false,
  onSave,
}: Props) {
  return (
    <AppDialog
      title={`Time for ${blockLabel}`}
      description="Where this part is heard in the YouTube reference."
      trigger={
        <button
          type="button"
          aria-label={`Set YouTube time for ${blockLabel}`}
          title={
            refTime !== undefined
              ? `YouTube time: ${formatSeconds(refTime)}`
              : "Set YouTube time"
          }
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center justify-center gap-0.5 p-1.5 min-h-9 min-w-9 text-xs tabular-nums ${
            refTime !== undefined
              ? "text-amber-400/90 hover:text-amber-300"
              : "text-zinc-400 hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          {refTime !== undefined ? formatSeconds(refTime) : null}
        </button>
      }
    >
      <RefTimeForm
        refTime={refTime}
        hasYoutubeUrl={hasYoutubeUrl}
        onSave={onSave}
      />
    </AppDialog>
  )
}

/** Separate component so local state resets every time the dialog opens. */
function RefTimeForm({
  refTime,
  hasYoutubeUrl,
  onSave,
}: {
  refTime?: number
  hasYoutubeUrl: boolean
  onSave: (refTime: number | undefined) => void
}) {
  const [value, setValue] = useState(
    refTime !== undefined ? formatSeconds(refTime) : "",
  )

  const trimmed = value.trim()
  const parsed = trimmed === "" ? null : parseTimeToSeconds(trimmed)
  const invalid = trimmed !== "" && parsed === null

  return (
    <div className="flex flex-col gap-3">
      {!hasYoutubeUrl ? (
        <p className="text-xs text-amber-300/90 bg-amber-400/5 border border-amber-500/20 rounded-md px-3 py-2 light:text-amber-700">
          This song has no YouTube link yet. Add one in the song details so this
          time can be played.
        </p>
      ) : null}

      <div>
        <Label htmlFor="block-ref-time">Time (m:ss)</Label>
        <Input
          id="block-ref-time"
          name="block-ref-time"
          alwaysEditable
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0:45"
          inputMode="numeric"
        />
        {invalid ? (
          <p className="text-red-500 text-sm mt-1">
            Use m:ss (e.g. 0:45 or 1:02:35)
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3">
        {refTime !== undefined ? (
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={() => onSave(undefined)}
            >
              Remove time
            </Button>
          </Dialog.Close>
        ) : null}
        <Dialog.Close asChild>
          <Button
            type="button"
            variant="primary"
            className="min-h-11"
            disabled={invalid || trimmed === ""}
            onClick={() => {
              if (parsed !== null) onSave(parsed)
            }}
          >
            Save
          </Button>
        </Dialog.Close>
      </div>
    </div>
  )
}
