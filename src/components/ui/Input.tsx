import { useRef, useState, useId } from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  value: string
  placeholder?: string
  type?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  tabIndex?: number
}

export default function InputInline({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  tabIndex,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fieldId = useId()

  const handleFocus = () => setIsEditing(true)

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }

  return (
    <input
      id={fieldId}
      name={name}
      ref={inputRef}
      value={value}
      type={type}
      onChange={onChange}
      tabIndex={tabIndex}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 rounded-md text-sm ${
        isEditing
          ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          : "border border-zinc-400/25 cursor-text text-indigo-300"
      }`}
      placeholder={placeholder}
    />
  )
}
