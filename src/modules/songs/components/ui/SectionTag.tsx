type Props = {
  typeName: string
  label?: string
}

export const SectionTag = ({ typeName, label }: Props) => {
  const display = label?.trim() ? label.trim() : typeName

  return (
    <p
      className="
        section-tag
        inline-block 
        bg-blue-100/5
        text-violet-400/90  
        border-2 
        border-violet-900/60 
        px-4 py-2 
        rounded-r-xl 
        text-xs"
    >
      [{display}]
    </p>
  )
}
