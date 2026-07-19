export interface RepertoireItem {
  id: string
  songId: string
  transposeSemitones: number
  notes?: string
}

export interface RepertoireGroup {
  id: string
  /** Empty string = default untitled group */
  title: string
  items: RepertoireItem[]
}

export interface Repertoire {
  id: string
  title: string
  date?: string
  groups: RepertoireGroup[]
  createdAt: string
  updatedAt: string
}
