
export interface Song {
  id: string,
  title: string,
  author: string,
  songSections: SectionType[]
}

export const SECTION_OPTIONS = [
  "INTRO",
  "VERSE",
  "PRE-CHORUS",
  "CHORUS",
  "BRIDGE",
  "INSTRUMENTAL",
  "OUTRO"
] as const

export type SectionType = typeof SECTION_OPTIONS[number]
