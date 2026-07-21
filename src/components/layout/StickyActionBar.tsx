type Props = {
  children: React.ReactNode
  className?: string
}

export function StickyActionBar({ children, className = "" }: Props) {
  return (
    <div
      className={`sticky bottom-0 z-20 -mx-4 px-4 py-3 mt-4
        bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800
        light:bg-white/95 light:border-zinc-200
        flex justify-end gap-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
        ${className}`}
    >
      {children}
    </div>
  )
}
