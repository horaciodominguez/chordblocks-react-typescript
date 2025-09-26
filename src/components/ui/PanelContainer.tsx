type Props = {
  children: React.ReactNode
}

export default function PanelContainer({ children }: Props) {
  return (
    <div className="relative">
      <div
        className="bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0
          box-border absolute top-0 left-0 z-10 w-full h-px"
      >
        <div className="w-full h-px bg-gradient-to-r from-indigo-700/0 from-30% via-red-600/100 via-65% to-indigo-900/0 to-90%"></div>
      </div>
      <div className="border-[.1px] border-zinc-200/10 rounded-md bg-white/5 backdrop-filter backdrop-blur-md p-6 w-full shadow-md shadow-zinc-900/20  relative">
        {children}
      </div>
      <div
        className="bg-gradient-to-r from-indigo-700/0 from-40% via-indigo-600/100 via-75% to-indigo-900/0 to-95%%
          box-border absolute bottom-0 left-0 z-10 w-full h-px"
      ></div>
    </div>
  )
}
