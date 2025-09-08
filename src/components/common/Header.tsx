import { Link } from "react-router-dom"

import { ListMusic, ListPlus } from "lucide-react"

export function Header() {
  return (
    <>
      <h1 className="text-gray-200 text-3xl uppercase text-center p-6">
        SongBlocks
      </h1>
      <nav className="my-4">
        <ul className="flex gap-2">
          <li className="border-[.1px] bg-zinc-100/5 border-blue-900 rounded-md shadow-md hover:bg-zinc-100/10 hover:border-blue-600 transition-all">
            <Link
              to="/"
              className="flex flex-col justify-center items-center py-2 px-4 "
            >
              <ListMusic className="text-zinc-200 mb-2" />
              <span className="text-zinc-200 text-xs font-bold uppercase">
                Song List
              </span>
            </Link>
          </li>
          <li className="border-[.1px] bg-zinc-100/5 border-blue-900 rounded-md shadow-md hover:bg-zinc-100/10 hover:border-blue-600 transition-all">
            <Link
              to="/new"
              className="flex flex-col justify-center items-center py-2 px-4"
            >
              <ListPlus className="text-zinc-200 mb-2" />
              <span className="text-zinc-200 text-xs font-bold uppercase">
                Add Song
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
