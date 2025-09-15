type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "save" | "cancel"
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  const base =
    "rounded-4xl px-4 py-2 font-semibold transition-colors duration-100 ease-in-out"
  const variants = {
    primary: "bg-gray-300 text-black hover:bg-gray-100  ",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    save: "bg-indigo-800 text-white hover:bg-indigo-700",
    cancel: "bg-gray-800 font-medium hover:bg-gray-700",
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
