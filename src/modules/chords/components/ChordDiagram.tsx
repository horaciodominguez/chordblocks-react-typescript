import { resolveDiagramSpriteId } from "@/modules/chords/data/chordFingerings"

export type Props = {
  chordName: string
  /** 0 = primary; 1 = v2; 2 = v3. Missing alts fall back to primary. */
  voicing?: number
  size?: number
}

export default function ChordDiagram({
  chordName,
  voicing = 0,
  size,
}: Props) {
  const diagramId = resolveDiagramSpriteId(chordName, voicing)

  return (
    <>
      <picture>
        <svg
          className="w-[64px] h-[64px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <use
            href={`/assets/chords-sprite.svg#${diagramId}`}
            className="text-zinc-100 light:text-zinc-700"
            fill="currentColor"
            width={size || 64}
            height={size || 64}
          />
        </svg>
      </picture>
    </>
  )
}
