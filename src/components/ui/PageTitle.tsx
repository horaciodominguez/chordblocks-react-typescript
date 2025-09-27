type Props = {
  children: React.ReactNode
}

export default function PageTitle({ children }: Props) {
  return <h2 className="page-title m-4">{children}</h2>
}
