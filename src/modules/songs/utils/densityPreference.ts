import {
  DENSITY_STORAGE_KEY,
  type SongDensity,
} from "@/modules/songs/types/density.types"

function isSongDensity(v: string | null): v is SongDensity {
  return v === "bars" || v === "guide"
}

/** Read saved density, or default: guide on mobile, bars on desktop. */
export function readDensityPreference(): SongDensity {
  try {
    const stored = localStorage.getItem(DENSITY_STORAGE_KEY)
    if (isSongDensity(stored)) return stored
  } catch {
    /* ignore */
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  ) {
    return "guide"
  }

  return "bars"
}

export function writeDensityPreference(density: SongDensity): void {
  try {
    localStorage.setItem(DENSITY_STORAGE_KEY, density)
  } catch {
    /* ignore */
  }
}
