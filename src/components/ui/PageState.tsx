import { Link } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import LoaderSpinner from "@/components/ui/LoaderSpinner"
import EmptyState from "@/components/ui/EmptyState"

type LoadingProps = {
  variant: "loading"
  title?: string
  backTo: string
}

type NotFoundProps = {
  variant: "notFound"
  title?: string
  message: string
  backTo: string
  backLabel?: string
  secondaryTo?: string
  secondaryLabel?: string
}

type Props = LoadingProps | NotFoundProps

const linkClass =
  "inline-flex items-center justify-center min-h-11 px-4 rounded-sm border border-zinc-100/10 bg-indigo-800 text-sm font-semibold text-white hover:bg-indigo-700 light:border-zinc-200 light:bg-indigo-600 light:hover:bg-indigo-500"

const secondaryLinkClass =
  "inline-flex items-center justify-center min-h-11 px-4 rounded-sm border border-zinc-100/10 bg-zinc-200/5 text-sm font-semibold text-white hover:bg-zinc-200/10 light:border-zinc-200 light:bg-white light:text-zinc-900 light:hover:bg-zinc-50"

export function PageState(props: Props) {
  if (props.variant === "loading") {
    return (
      <>
        <PageHeader title={props.title ?? "Loading…"} backTo={props.backTo} />
        <LoaderSpinner />
      </>
    )
  }

  return (
    <>
      <PageHeader title={props.title ?? "Not found"} backTo={props.backTo} />
      <EmptyState
        title={props.message}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to={props.backTo} className={linkClass}>
              {props.backLabel ?? "Go back"}
            </Link>
            {props.secondaryTo && props.secondaryLabel ? (
              <Link to={props.secondaryTo} className={secondaryLinkClass}>
                {props.secondaryLabel}
              </Link>
            ) : null}
          </div>
        }
      />
    </>
  )
}

export default PageState
