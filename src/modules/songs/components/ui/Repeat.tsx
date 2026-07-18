import React from "react"

type Props = {
  repeats: number
}

/** Visual repeat bars — prefer showing ×N badge on the section header instead. */
export const Repeat: React.FC<Props> = ({ repeats }) => {
  if (repeats <= 1) return null

  return (
    <div
      className="flex flex-col items-center justify-center text-gray-300 pl-2 shrink-0 self-stretch"
      aria-label={`Repeat ${repeats} times`}
    >
      {repeats > 2 && (
        <span className="text-xs mb-1 text-blue-400 font-semibold select-none">
          ×{repeats}
        </span>
      )}
      <div className="flex h-full items-center gap-[4px] select-none">
        <span className="text-lg leading-none flex flex-col justify-center gap-1 items-center">
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="h-1 w-1 rounded-full bg-gray-300" />
        </span>
        <div className="flex h-10 items-stretch gap-[2px]">
          <div className="w-[1px] bg-gray-300" />
          <div className="w-[2px] bg-gray-300" />
        </div>
      </div>
    </div>
  )
}
