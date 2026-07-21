import { useId, useRef, useState } from "react"

/** Shared surface for inputs / selects — matches primary Button chrome. */
export const controlSurfaceClass =
  "min-h-11 rounded-sm border border-zinc-100/10 bg-zinc-200/5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/40"

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  name: string
  value: string | number
  placeholder?: string
  type?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  tabIndex?: number
  min?: number
  icon?: React.ReactNode
  id?: string
}

export default function Input({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  tabIndex,
  icon,
  id,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const generatedId = useId()
  const fieldId = id ?? generatedId

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
        aria-readonly={!isEditing}
        className={`w-full px-3 py-2 ${controlSurfaceClass} placeholder:text-zinc-500 ${
          icon ? "pl-9 pr-3" : "px-3"
        } ${isEditing ? "" : "cursor-text"}`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}
