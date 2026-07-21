type Props = {
  typeName: string
  label?: string
}

export const SectionTag = ({ typeName, label }: Props) => {
  const display = label?.trim() ? label.trim() : typeName

  return (
    <p
      className="inline-block rounded-r-xl border-2 border-violet-900/60 bg-blue-100/5 px-4 py-2 text-xs text-violet-400/90 guide:border guide:px-2 guide:py-0.5 guide:text-[10px]"
    >
      [{display}]
    </p>
  )
}
