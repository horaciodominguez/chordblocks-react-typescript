import React from "react"

type Props = {
  repeats: number
}

export const Repeat: React.FC<Props> = ({ repeats }) => {
  if (repeats <= 1) return null

  return (
    <div className="absolute h-full bottom-0 right-0 flex flex-col items-center text-gray-300">
      {repeats > 2 && (
        <span className="text-xs mb-1 text-blue-400 font-semibold select-none absolute -top-5 -right-1 h-[5px]">
          x{repeats}
        </span>
      )}

      {/* símbolo :||  */}
      <div className="flex h-full items-end gap-[4px] select-none">
        <span className="text-lg leading-none h-full flex flex-col justify-center gap-1 items-center">
          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        </span>
        <div className="flex h-full items-end">
          <div className="w-[1px] h-full bg-gray-300"></div>
          <div className="w-[2px] h-full bg-gray-300 ml-[2px]"></div>
        </div>
      </div>
    </div>
  )
}
