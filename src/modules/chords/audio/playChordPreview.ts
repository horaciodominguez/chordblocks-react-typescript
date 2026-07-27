import { chordPreviewMidiNotes } from "@/modules/chords/audio/chordPreviewNotes"
import { midiToFrequency } from "@/modules/chords/audio/fretToMidi"
import { readChordPreviewPreference } from "@/modules/chords/audio/chordPreviewPreference"

let sharedContext: AudioContext | null = null
let masterGain: GainNode | null = null

function getAudioGraph(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined") return null
  const Ctx =
    window.AudioContext ??
    (
      window as unknown as {
        webkitAudioContext?: typeof AudioContext
      }
    ).webkitAudioContext
  if (!Ctx) return null

  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new Ctx()
    masterGain = sharedContext.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(sharedContext.destination)
  }

  if (!masterGain) return null
  return { ctx: sharedContext, out: masterGain }
}

const STRUM_OFFSET_SEC = 0.04
const NOTE_DURATION_SEC = 0.7
const PEAK_GAIN = 0.45

function scheduleChord(ctx: AudioContext, destination: AudioNode, midis: number[]) {
  const t0 = ctx.currentTime + 0.03
  for (let i = 0; i < midis.length; i++) {
    const start = t0 + i * STRUM_OFFSET_SEC
    const end = start + NOTE_DURATION_SEC
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.value = midiToFrequency(midis[i]!)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, start + 0.025)
    gain.gain.linearRampToValueAtTime(0.001, end)
    osc.connect(gain)
    gain.connect(destination)
    osc.start(start)
    osc.stop(end + 0.08)
  }
}

/**
 * Play a short strummed chord preview. Must be called synchronously from a user
 * gesture (click/tap) so AudioContext can start.
 */
export function playChordPreview(chordName: string, voicing = 0): void {
  if (!readChordPreviewPreference()) return

  const graph = getAudioGraph()
  if (!graph) return

  const { ctx, out } = graph

  // Resume in the same turn as the click — do not await (breaks user activation).
  if (ctx.state === "suspended") {
    void ctx.resume()
  }

  const midis = chordPreviewMidiNotes(chordName, voicing)
  if (midis.length === 0) return

  scheduleChord(ctx, out, midis)
}
