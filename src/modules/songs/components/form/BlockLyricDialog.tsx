import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Type } from "lucide-react"
import { AppDialog } from "@/components/ui/AppDialog"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"

const MAX_LYRIC = 80

type Props = {
  lyric?: string
  onSave: (lyric: string | undefined) => void
}

/**
 * Edit-mode control to set a short lyric fragment under a block.
 */
export function BlockLyricDialog({ lyric, onSave }: Props) {
  const hasLyric = Boolean(lyric?.trim())
  return (
    <AppDialog
      title="Lyric"
      description="Short phrase under this block on the chart (optional)."
      trigger={
        <button
          type="button"
          aria-label={hasLyric ? `Edit lyric: ${lyric}` : "Add lyric"}
          title={hasLyric ? lyric : "Add lyric"}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center justify-center p-1.5 min-h-9 min-w-9 ${
            hasLyric
              ? "text-cyan-400/90 hover:text-cyan-300"
              : "text-zinc-400 hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
          }`}
        >
          <Type className="w-4 h-4" />
        </button>
      }
    >
      <LyricForm lyric={lyric} onSave={onSave} />
    </AppDialog>
  )
}

function LyricForm({
  lyric,
  onSave,
}: {
  lyric?: string
  onSave: (lyric: string | undefined) => void
}) {
  const [value, setValue] = useState(lyric ?? "")
  const trimmed = value.trim()
  const tooLong = trimmed.length > MAX_LYRIC

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="block-lyric">Text</Label>
        <Input
          id="block-lyric"
          name="block-lyric"
          alwaysEditable
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Hello"
          maxLength={MAX_LYRIC + 10}
        />
        {tooLong ? (
          <p className="text-red-500 text-sm mt-1">Max {MAX_LYRIC} characters</p>
        ) : (
          <p className="text-xs text-zinc-500 mt-1 light:text-zinc-600">
            {trimmed.length}/{MAX_LYRIC}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {lyric?.trim() ? (
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={() => onSave(undefined)}
            >
              Remove
            </Button>
          </Dialog.Close>
        ) : null}
        <Dialog.Close asChild>
          <Button
            type="button"
            variant="primary"
            className="min-h-11"
            disabled={tooLong || trimmed === ""}
            onClick={() => onSave(trimmed)}
          >
            Save
          </Button>
        </Dialog.Close>
      </div>
    </div>
  )
}
