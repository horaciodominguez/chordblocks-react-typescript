
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger"
}

export default function Button ({ variant="primary", className="", ...props }: Props) {

    const base = "rounded-4xl px-4 py-2 font-semibold transition-colors"
    const variants = {
        primary: "bg-gray-800 font-medium hover:bg-gray-700 ",
        secondary: "bg-gray-300 text-black hover:bg-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700",
    }

    return (
        <button  className={`${base} ${variants[variant]} ${className}`} {...props} />
    )

}