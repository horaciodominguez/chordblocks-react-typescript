import Input from "./Input"
import Label from "./Label"
import { useId } from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  value: string
  type?: string
  icon?: React.ReactNode
  tabIndex?: number
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function InputInline({
  name,
  label,
  value,
  type = "text",
  onChange,
  tabIndex,
  icon,
}: Props) {
  const fieldId = useId()

  return (
    <>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        tabIndex={tabIndex}
        id={fieldId}
        icon={icon}
      />
    </>
  )
}
