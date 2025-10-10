import { z } from "zod"
import { SECTION_OPTIONS, BEAT_VALUES, noteValues } from "../constants/song"

const oneOfNumbers = (allowed: readonly number[], message: string) =>
  z
    .number()
    .int()
    .refine((v) => allowed.includes(v), { message })

// Definí qué es un acorde dentro del block
const ChordSchema = z.object({
  name: z.string().min(1, "Chord name is required"),
  // si después agregás otros campos (tensión, inversión, etc.) los sumás acá
})

// Un bloque de tipo "chord"
const ChordBlockSchema = z.object({
  id: z.string(),
  type: z.literal("chord"),
  chord: ChordSchema, // 👈 ahora sí se valida y conserva
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
})

// Un bloque de tipo "rest"
const RestBlockSchema = z.object({
  id: z.string(),
  type: z.literal("rest"),
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
})

// Discriminated union: según el `type`, valida el bloque correcto
export const BlockSchema = z.discriminatedUnion("type", [
  ChordBlockSchema,
  RestBlockSchema,
])

export const BarSchema = z.object({
  id: z.string(),
  blocks: z.array(BlockSchema).min(1, "Bar must have at least one block"),
  position: z.number().int().min(1, "Min position is 1"),
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
  artist: z.string().min(1, "Artist is required"),
  timeSignature: TimeSignatureSchema,
  songSections: z.array(SectionSchema).min(1, "Add at least one section"),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type SongParsed = z.infer<typeof SongSchema>
