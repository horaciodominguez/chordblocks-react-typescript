/**
 * Returns the CSS width (string with %) of a chord, given its duration and the beats per measure.
 * Example: a chord with duration 2 in 4/4 will have a width of 50%.
 * @param duration Duration of the chord (in beats)
 * @param beatsPerMeasure Beats per measure (time signature)
 * @returns CSS width in %
 */
export const chordWidth = (duration: number, beatsPerMeasure: number): string =>
  `${(duration / beatsPerMeasure) * 100}%`

/**
 * Returns the CSS width (string with %) of a bar, given the beats per measure.
 * Example: in 4/4 the width will be 25% (4 bars per row), in 3/4 or 6/8 it will be 33.33% (3 bars per row).
 * @param beatsPerMeasure Beats per measure (time signature)
 * @returns CSS width in %
 */

export const barWidthByTS = (beatsPerMeasure: number): string =>
  beatsPerMeasure === 3 || beatsPerMeasure === 6 ? `${100 / 3}%` : `${100 / 4}%`
