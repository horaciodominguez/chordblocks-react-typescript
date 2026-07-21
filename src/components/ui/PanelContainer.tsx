import Panel from "@/components/ui/Panel"

type Props = {
  children: React.ReactNode
}

/** @deprecated Prefer `Panel variant="card"`. Kept for gradual migration. */
export default function PanelContainer({ children }: Props) {
  return <Panel variant="card">{children}</Panel>
}
