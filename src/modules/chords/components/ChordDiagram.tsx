export type Props = {
  chordName: string
}

export default function ChordDiagram({ chordName }: Props) {
  return (
    <>
      <picture>
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <use
            href={`/assets/chords-sprite.svg#${chordName}`}
            className="text-white"
            fill="currentColor"
            width={48}
            height={48}
          />
        </svg>
      </picture>
    </>
  )
}
