import { useRef, useState, useId } from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  value: string | number
  placeholder?: string
  type?: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  tabIndex?: number
  min?: number
  icon?: React.ReactNode
}

export default function Input({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  tabIndex,
  icon,
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
    <div className="relative w-full">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </div>
      )}
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
        className={`w-full px-3 py-2 rounded-md text-sm 
        ${icon ? "pl-9 pr-3" : "px-3"}
        ${
          isEditing
            ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            : "border border-zinc-400/25 cursor-text text-indigo-300"
        }`}
        placeholder={placeholder}
      />
    </div>
  )
}
