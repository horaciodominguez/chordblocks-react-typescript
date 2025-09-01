import { z } from "zod"
import { SECTION_OPTIONS, BEAT_VALUES, noteValues } from "../constants/song"

// Helpers para “enum” numéricas
const oneOfNumbers = (allowed: readonly number[], message: string) =>
  z
    .number()
    .int()
    .refine((v) => allowed.includes(v), { message })

export const BarChordSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Chord name is required"),
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
})

export const BarSchema = z.object({
  id: z.string(),
  chords: z.array(BarChordSchema).min(1, "Bar must have at least one chord"),
})

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(SECTION_OPTIONS),
  bars: z.array(BarSchema).min(1, "Section must have at least one bar"),
})

export const TimeSignatureSchema = z.object({
  beatsPerMeasure: oneOfNumbers(BEAT_VALUES, "Beats must be one of 1–12"),
  noteValue: oneOfNumbers(noteValues, "Note value must be 2, 4 or 8"),
})

export const SongSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Author is required"),
  timeSignature: TimeSignatureSchema,
  songSections: z.array(SectionSchema).min(1, "Add at least one section"),
})

export type SongParsed = z.infer<typeof SongSchema>
