import { z } from "zod"

export const RepertoireItemSchema = z.object({
  id: z.string().min(1),
  songId: z.string().min(1),
  transposeSemitones: z.number().int().min(-12).max(12),
  notes: z.string().optional(),
})

export const RepertoireGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  items: z.array(RepertoireItemSchema),
})

export const RepertoireSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  date: z.string().optional(),
  groups: z.array(RepertoireGroupSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type RepertoireParsed = z.infer<typeof RepertoireSchema>
