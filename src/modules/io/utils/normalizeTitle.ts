/** Normalize song title for duplicate detection. */
export function normalizeSongTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ")
}
