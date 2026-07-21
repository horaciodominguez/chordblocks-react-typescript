type Props = {
  children: React.ReactNode
}

export const pageTitleClass =
  "text-2xl font-medium font-thin uppercase text-center font-display text-zinc-200 light:text-zinc-800"

export default function PageTitle({ children }: Props) {
  return <h2 className={`${pageTitleClass} m-4`}>{children}</h2>
}
