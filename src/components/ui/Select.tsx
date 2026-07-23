import { useId, useState } from "react"
import Label from "./Label"
import { toast } from "sonner"
import { controlSurfaceClass } from "./Input"

type Props = {
  name: string
  label?: string
  options: readonly (string | number)[]
  /** Optional display labels keyed by option value (e.g. sort keys). */
  optionLabels?: Record<string, string>
  disabled?: boolean
  disabledMessage?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
  ref?: React.Ref<HTMLSelectElement>
  tabIndex?: number
  id?: string
}

export const Select = ({
  name,
  label,
  options,
  optionLabels,
  disabled,
  disabledMessage,
  value,
  onChange,
  defaultValue,
  ref,
  tabIndex,
  id,
}: Props) => {
  const isControlled = value !== undefined && onChange !== undefined
  const generatedId = useId()
  const fieldId = id ?? name ?? generatedId

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="w-full">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      {disabled && disabledMessage ? (
        <div
          id={fieldId}
          role="button"
          aria-disabled="true"
          aria-label={label ?? name}
          onClick={() => toast.message(disabledMessage)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              toast.message(disabledMessage)
            }
          }}
          className={`${controlSurfaceClass} w-full px-3 py-2 opacity-80 cursor-not-allowed`}
          title={disabledMessage}
          tabIndex={tabIndex ?? 0}
        >
          {value || defaultValue}
        </div>
      ) : (
        <select
          name={name}
          id={fieldId}
          onChange={onChange}
          disabled={disabled}
          aria-label={label ?? name}
          {...(isControlled ? { value } : { defaultValue, ref })}
          onClick={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className={`w-full px-3 py-2 ${controlSurfaceClass} ${
            isEditing ? "border-indigo-500/40 light:border-indigo-400/50" : ""
          }`}
          tabIndex={tabIndex}
        >
          {defaultValue != undefined && defaultValue != "" ? (
            <option
              value=""
              className="bg-zinc-800 text-white light:bg-white light:text-zinc-900"
            >
              {defaultValue}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-zinc-800 text-white light:bg-white light:text-zinc-900"
            >
              {optionLabels?.[String(option)] ?? option}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
