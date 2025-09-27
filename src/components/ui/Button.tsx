type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "save" | "cancel" | "delete"
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  const base = `
  block
  rounded-sm 
  px-4 py-2 
  text-sm border-[.1px] 
  border-zinc-100/10
  relative 
  font-semibold
  transition-colors duration-100 ease-in-out`
  const variants = {
    primary: "bg-zinc-200/5 text-white hover:bg-zinc-200/10  ",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    save: "bg-indigo-800 text-white hover:bg-indigo-700",
    cancel: "bg-zinc-800 hover:bg-zinc-700",
    delete: "bg-red-700/80 backdrop-blur-sm hover:bg-red-700/90 text-white",
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="absolute top-[-1px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-700/0 via-zinc-100/40 via-30% to-indigo-900/0 z-10"></span>
      {props.children}
      <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-700/0 via-zinc-100/40 via-70% to-indigo-900/0 z-11"></span>
    </button>
  )
}
