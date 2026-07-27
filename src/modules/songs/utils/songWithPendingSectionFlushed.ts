import type { Song } from "@/modules/songs/types/song.types"
import type {
  SectionType,
  SongSection,
} from "@/modules/songs/types/section.types"
import type { SongFormState } from "@/modules/songs/state/songFormReducer"
import { effectiveTimeSignature } from "@/modules/songs/utils/effectiveTimeSignature"
import { normalizePickupBeats } from "@/modules/songs/utils/beats"

function sectionFromPending(
  pending: SongFormState["pendingSection"],
  songTs: Song["timeSignature"],
): SongSection | null {
  if (pending.id === "" || pending.type === "") return null
  if (pending.bars.length === 0) return null

  const bpm = effectiveTimeSignature(songTs, pending.timeSignature)
    .beatsPerMeasure
  const pickup = normalizePickupBeats(pending.pickupBeats, bpm)

  return {
    id: pending.id,
    type: pending.type as SectionType,
    bars: pending.bars,
    repeats: pending.repeats,
    ...(pending.label?.trim() ? { label: pending.label.trim() } : {}),
    ...(typeof pending.cueTime === "number" ? { cueTime: pending.cueTime } : {}),
    ...(pending.timeSignature
      ? { timeSignature: { ...pending.timeSignature } }
      : {}),
    ...(pickup != null ? { pickupBeats: pickup } : {}),
  }
}

/**
 * If the form still has an open pending/editing section, merge it into the
 * song snapshot used for save — otherwise Sync times / edits are lost when
 * the user hits "Update Song" without "Save section".
 */
export function songWithPendingSectionFlushed(state: SongFormState): {
  song: Song
  didFlush: boolean
  error?: string
} {
  const built = sectionFromPending(
    state.pendingSection,
    state.song.timeSignature,
  )
  if (!built) {
    if (state.pendingSection.id !== "" && state.pendingSection.bars.length === 0) {
      return {
        song: state.song,
        didFlush: false,
        error: "Finish the open section (add at least one bar) before saving.",
      }
    }
    return { song: state.song, didFlush: false }
  }

  if (state.editingSectionId) {
    return {
      didFlush: true,
      song: {
        ...state.song,
        songSections: state.song.songSections.map((s) =>
          s.id === state.editingSectionId ? built : s,
        ),
        updatedAt: new Date().toISOString(),
      },
    }
  }

  // New section not yet finalized
  const already = state.song.songSections.some((s) => s.id === built.id)
  if (already) {
    return {
      didFlush: true,
      song: {
        ...state.song,
        songSections: state.song.songSections.map((s) =>
          s.id === built.id ? built : s,
        ),
        updatedAt: new Date().toISOString(),
      },
    }
  }

  return {
    didFlush: true,
    song: {
      ...state.song,
      songSections: [...state.song.songSections, built],
      updatedAt: new Date().toISOString(),
    },
  }
}
