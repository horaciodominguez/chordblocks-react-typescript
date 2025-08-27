type Props = {
  typeName: string
}

export const SectionTag = ({typeName} : Props) => {
  return (
    <>
      <p className="
        inline-block 
        bg-blue-100/5
        text-violet-400/90  
        border-2 
        border-violet-900/60 
        px-4 py-2 
        rounded-r-xl 
        text-xs 
        mr-2 
        mt-1 
        mb-4">
        { typeName }
      </p>
    </>
  )
}