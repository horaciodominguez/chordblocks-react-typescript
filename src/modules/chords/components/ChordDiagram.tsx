export type Props = {
  chordName: string
  size?: number
}

export default function ChordDiagram({ chordName, size }: Props) {
  const diagramId = chordName.includes("/")
    ? chordName.slice(0, chordName.indexOf("/"))
    : chordName

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
