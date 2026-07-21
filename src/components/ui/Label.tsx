type Props = {
  children: React.ReactNode
  htmlFor?: string
}

export default function Label({ children, htmlFor }: Props) {
  return (
    <label
      className="block text-xs font-medium text-zinc-400 mb-1"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
