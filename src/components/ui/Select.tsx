import { useState } from "react"
import Label from "./Label"

type Props = {
  name: string
  label: string
  options: readonly (string | number)[]
  disabled?: boolean
  disabledMessage?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
  ref?: React.Ref<HTMLSelectElement>
  tabIndex?: number
}

export const Select = ({
  name,
  label,
  options,
  disabled,
  disabledMessage,
  value,
  onChange,
  defaultValue,
  ref,
  tabIndex,
}: Props) => {
  const isControlled = value !== undefined && onChange !== undefined

  const [isEditing, setIsEditing] = useState(false)

  const baseClass =
    "w-full border text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      {disabled && disabledMessage ? (
        <div
          id={name}
          aria-label={label}
          onClick={() => alert(disabledMessage)}
          className="w-full border border-indigo-600 px-3 py-2 rounded-md "
          title={label}
          tabIndex={tabIndex}
        >
          {value || defaultValue}
        </div>
      ) : (
        <select
          name={name}
          id={name}
          onChange={onChange}
          disabled={disabled}
          aria-label={label}
          {...(isControlled ? { value } : { defaultValue, ref })}
          onClick={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className={`${baseClass} ${
            isEditing ? "border-gray-300" : "border-zinc-400/25"
          }`}
          tabIndex={tabIndex}
        >
          {defaultValue != undefined && defaultValue === "" ? (
            <option value="" className="bg-gray-800 text-white">
              SELECT...
            </option>
          ) : (
            ""
          )}
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-gray-800 text-white"
            >
              {option}
            </option>
          ))}
        </select>
      )}
    </>
  )
}
