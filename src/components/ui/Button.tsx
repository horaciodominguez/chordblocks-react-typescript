type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "save" | "cancel" | "delete"
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}: Props) {
  const base = `
  inline-flex items-center justify-center
  rounded-sm 
  px-4 py-2 
  text-sm border 
  border-zinc-100/10
  light:border-zinc-200
  relative 
  font-semibold
  min-h-11
  transition-colors duration-100 ease-in-out
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
  disabled:opacity-50 disabled:pointer-events-none`
  const variants = {
    primary: "bg-zinc-200/5 text-white hover:bg-zinc-200/10 light:bg-white light:text-zinc-900 light:hover:bg-zinc-50 light:border-zinc-200",
    secondary: "bg-zinc-700 text-white hover:bg-zinc-600 light:bg-zinc-200 light:text-zinc-900 light:hover:bg-zinc-300",
    save: "bg-indigo-800 text-white hover:bg-indigo-700 light:bg-indigo-600 light:hover:bg-indigo-500",
    cancel: "bg-zinc-800 hover:bg-zinc-700 light:bg-zinc-100 light:text-zinc-900 light:hover:bg-zinc-200",
    delete: "bg-red-700/80 backdrop-blur-sm hover:bg-red-700/90 text-white light:bg-red-600 light:hover:bg-red-700",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="absolute top-[-1px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-700/0 via-zinc-100/40 via-30% to-indigo-900/0 light:via-indigo-300/50 z-10"></span>
      {props.children}
      <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-700/0 via-zinc-100/40 via-70% to-indigo-900/0 light:via-indigo-300/50 z-11"></span>
    </button>
  )
}
