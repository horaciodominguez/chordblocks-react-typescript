import { z } from "zod"
import { SECTION_OPTIONS, BEAT_VALUES, noteValues } from "../constants/song"
import { isValidYouTubeUrl } from "../utils/youtube"

const oneOfNumbers = (allowed: readonly number[], message: string) =>
  z
    .number()
    .int()
    .refine((v) => allowed.includes(v), { message })

const ChordSchema = z.object({
  name: z.string().min(1, "Chord name is required"),
})

const ChordBlockSchema = z.object({
  id: z.string(),
  type: z.literal("chord"),
  chord: ChordSchema,
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
})

const RestBlockSchema = z.object({
  id: z.string(),
  type: z.literal("rest"),
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
})

const RefTimeSchema = z
  .number()
  .int()
  .min(0, "Time must be 0 or more seconds")
  .optional()

const RiffBlockSchema = z.object({
  id: z.string(),
  type: z.literal("riff"),
  label: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().min(1).optional(),
  ),
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
  refTime: RefTimeSchema,
})

const SoloBlockSchema = z.object({
  id: z.string(),
  type: z.literal("solo"),
  duration: z.number().int().min(1, "Min duration is 1").max(12, "Max is 12"),
  position: z.number().int().min(1, "Min position is 1"),
  refTime: RefTimeSchema,
})

export const BlockSchema = z.discriminatedUnion("type", [
  ChordBlockSchema,
  RestBlockSchema,
  RiffBlockSchema,
  SoloBlockSchema,
])

export const BarSchema = z.object({
  id: z.string(),
  blocks: z.array(BlockSchema).min(1, "Bar must have at least one block"),
  position: z.number().int().min(1, "Min position is 1"),
})

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(SECTION_OPTIONS),
  label: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().min(1).optional(),
  ),
  bars: z.array(BarSchema).min(1, "Section must have at least one bar"),
  repeats: z.number().int().min(1, "Min repeats is 1"),
})

export const TimeSignatureSchema = z.object({
  beatsPerMeasure: oneOfNumbers(BEAT_VALUES, "Beats must be one of 2-12"),
  noteValue: oneOfNumbers(noteValues, "Note value must be 2, 4 or 8"),
})

export const SongSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  genre: z.string().min(1, "Genre is required"),
  year: z
    .number()
    .int()
    .min(1900, "Year must be valid")
    .max(2100, "Year must be valid"),
  timeSignature: TimeSignatureSchema,
  mainKey: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().min(1).optional(),
  ),
  youtubeUrl: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z
      .string()
      .refine(isValidYouTubeUrl, "Enter a valid YouTube link")
      .optional(),
  ),
  imageBase64: z.string().nullable(),
  imageUrl: z.string().nullable(),
  seedOriginId: z.string().optional(),
  songSections: z.array(SectionSchema).min(1, "Add at least one section"),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type SongParsed = z.infer<typeof SongSchema>
