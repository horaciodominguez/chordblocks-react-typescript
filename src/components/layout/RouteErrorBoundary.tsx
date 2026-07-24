import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import EmptyState from "@/components/ui/EmptyState"

type Props = {
  children: ReactNode
  /** When this changes (e.g. pathname), clear a captured error. */
  resetKey?: string
}

type State = {
  error: Error | null
}

/**
 * Catches render errors in a route tree so one bad screen does not blank the whole app.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("RouteErrorBoundary:", error, info.componentStack)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  private retry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <EmptyState
          icon={<AlertTriangle size={40} aria-hidden />}
          title="Something went wrong"
          description={
            import.meta.env.DEV
              ? this.state.error.message
              : "This screen crashed. Try again or open another page."
          }
          actionLabel="Try again"
          onAction={this.retry}
        />
      )
    }
    return this.props.children
  }
}
