interface Props {
  children: React.ReactNode
}

export default function SectionChords({ children }: Props) {
  return (
    <>
      <div className="SECTIONCHORDS-WRAP flex gap-2 py-2 divide-x-2 divide-blue-900  ">
        {children}
      </div>
    </>
  )
}
