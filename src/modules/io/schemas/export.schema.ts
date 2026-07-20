import { z } from "zod"
import { SongSchema } from "@/modules/songs/schemas/song.schema"
import { RepertoireSchema } from "@/modules/repertoires/schemas/repertoire.schema"
import { CHORD_BLOCKS_EXPORT_VERSION } from "@/modules/io/types/export.types"

export const ChordBlocksExportSchema = z.object({
  version: z.literal(CHORD_BLOCKS_EXPORT_VERSION),
  exportedAt: z.string().min(1),
  songs: z.array(SongSchema).min(1, "Export must include at least one song"),
  repertoires: z.array(RepertoireSchema).optional(),
})

export type ChordBlocksExportParsed = z.infer<typeof ChordBlocksExportSchema>
