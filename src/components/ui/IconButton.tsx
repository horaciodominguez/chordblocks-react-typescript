import { forwardRef } from "react"
import { Link } from "react-router-dom"

type Variant = "default" | "danger" | "ghost"

const variantClass: Record<Variant, string> = {
  default:
    "border border-zinc-700 text-indigo-400 hover:text-zinc-200 light:border-zinc-200 light:text-indigo-600 light:hover:text-indigo-800",
  danger:
    "border border-zinc-700 text-red-400 hover:text-red-300 light:border-zinc-200 light:text-red-600 light:hover:text-red-700",
  ghost:
    "border border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 light:text-zinc-600 light:hover:text-zinc-900 light:hover:border-zinc-200",
}

const baseClass =
  "inline-flex justify-center items-center min-h-11 min-w-11 rounded-md text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-40 disabled:pointer-events-none"

type CommonProps = {
  variant?: Variant
  className?: string
  "aria-label": string
  children: React.ReactNode
}

type ButtonProps = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "aria-label" | "className"
  > & {
    to?: undefined
  }

type LinkProps = CommonProps & {
  to: string
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonProps | LinkProps
>(function IconButton(props, ref) {
  const variant = props.variant ?? "default"
  const className = props.className ?? ""
  const classes = `${baseClass} ${variantClass[variant]} ${className}`

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} aria-label={props["aria-label"]} className={classes}>
        {props.children}
      </Link>
    )
  }

  const {
    variant: _v,
    className: _c,
    children,
    to: _to,
    "aria-label": ariaLabel,
    type = "button",
    ...rest
  } = props as ButtonProps

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
})

export default IconButton
