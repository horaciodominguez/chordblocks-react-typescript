import Label from "./Label"
import { useRef, useState } from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  value: string
  type?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function InputInline({
  name,
  label,
  value,
  type = "text",
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      if (inputRef.current) {
        inputRef.current.value = value
      }
    }
    setIsEditing(false)
  }

  const handleClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 0)
  }

  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      {isEditing ? (
        <input
          id={name}
          name={name}
          defaultValue={value ?? ""}
          type={type}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={onChange}
          onBlur={handleBlur}
          ref={inputRef}
        />
      ) : (
        <div
          className="w-full border border-gray-900 px-3 py-2 rounded-md cursor-text"
          onClick={handleClick}
        >
          {value || <span className="text-gray-400">Edit {label}</span>}
        </div>
      )}
    </>
  )
}
