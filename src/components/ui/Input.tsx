import { useId, useRef, useState } from "react"

/** Shared surface for inputs / selects / textareas — matches primary Button chrome. */
export const controlSurfaceClass =
  "min-h-11 rounded-sm border border-zinc-100/10 bg-zinc-200/5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/40 light:border-zinc-200 light:bg-white light:text-zinc-900 light:focus:ring-indigo-400 light:focus:border-indigo-400/40"

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
  /**
   * When true, skip click-to-edit (search, dates, dense forms).
   * Default false preserves legacy “tap to edit” meta fields.
   */
  alwaysEditable?: boolean
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
  alwaysEditable = false,
  className = "",
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(alwaysEditable)
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const editable = alwaysEditable || isEditing

  const handleFocus = () => {
    if (!alwaysEditable) setIsEditing(true)
  }

  const handleBlur = () => {
    if (!alwaysEditable) setIsEditing(false)
  }

  const handleClick = () => {
    if (!alwaysEditable && !isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 light:text-zinc-400">
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
        readOnly={!editable}
        aria-readonly={!editable}
        className={`w-full px-3 py-2 ${controlSurfaceClass} placeholder:text-zinc-500 light:placeholder:text-zinc-400 ${
          icon ? "pl-9 pr-3" : "px-3"
        } ${editable ? "" : "cursor-text"}`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}
