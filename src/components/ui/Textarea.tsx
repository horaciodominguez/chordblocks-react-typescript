import { useId } from "react"
import Label from "./Label"
import { controlSurfaceClass } from "./Input"

type Props = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> & {
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  label?: string
  id?: string
}

export function Textarea({
  name,
  value,
  onChange,
  label,
  id,
  className = "",
  rows = 3,
  ...rest
}: Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className="w-full">
      {label ? <Label htmlFor={fieldId}>{label}</Label> : null}
      <textarea
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 min-h-16 ${controlSurfaceClass} placeholder:text-zinc-500 light:placeholder:text-zinc-400 resize-y ${className}`}
        {...rest}
      />
    </div>
  )
}

export default Textarea
