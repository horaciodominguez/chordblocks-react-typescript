import { LoaderCircle } from "lucide-react"

export default function LoaderSpinner() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center py-4 text-indigo-400 text-[10px] animate-pulse">
        Loading...
      </div>
      <div>
        <LoaderCircle className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    </div>
  )
}
