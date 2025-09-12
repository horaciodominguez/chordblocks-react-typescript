/**
 * Returns the CSS width (string with %) of a chord, given its duration and the beats per measure.
 * Example: a chord with duration 2 in 4/4 will have a width of 50%.
 * @param duration Duration of the chord (in beats)
 * @param beatsPerMeasure Beats per measure (time signature)
 * @returns CSS width in %
 */
export const chordWidth = (duration: number, beatsPerMeasure: number): string =>
  `${(duration / beatsPerMeasure) * 100}%`
