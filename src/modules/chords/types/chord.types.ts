export interface Chord {
  name: string
  root?: string
  type?: string
  suffix?: string
  /**
   * Alternate fingering index for the same name (S3.3).
   * 0 / omitted = primary sprite; 1 = `__v2`; 2 = `__v3`.
   */
  voicing?: number
}
