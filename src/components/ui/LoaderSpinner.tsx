import { LoaderCircle } from "lucide-react"

export default function LoaderSpinner() {
  return (
    <div
      className="flex flex-col justify-center items-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center py-4 text-indigo-400 text-[10px] animate-pulse light:text-indigo-600">
        Loading...
      </div>
      <div>
        <LoaderCircle
          className="animate-spin w-12 h-12 text-indigo-500 light:text-indigo-600"
          aria-hidden
        />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
