export type Props = {
  chordName: string
  size?: number
}

export default function ChordDiagram({ chordName, size }: Props) {
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
            width={size || 48}
            height={size || 48}
          />
        </svg>
      </picture>
    </>
  )
}
