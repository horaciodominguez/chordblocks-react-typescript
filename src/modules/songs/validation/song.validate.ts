import { SongSchema } from "../schemas/song.schema"
import type { Song } from "../types/song.types"

export type ValidationErrorMap = Record<string, string>

export function validateSong(
  input: Song
): { ok: true; data: Song } | { ok: false; errors: ValidationErrorMap } {
  const res = SongSchema.safeParse(input)
  if (res.success) {
    return { ok: true, data: res.data as Song }
  }
  const errors: ValidationErrorMap = {}
  for (const issue of res.error.issues) {
    const path = issue.path.join(".")
    errors[path] = issue.message
  }
  return { ok: false, errors }
}
