interface Props {
  children: React.ReactNode
}

export default function SectionBlocks({ children }: Props) {
  return (
    <>
      <div className="SECTIONBLOCKS-WRAP flex gap-2 py-2 divide-x-2 divide-blue-900 relative ">
        {children}
      </div>
    </>
  )
}
