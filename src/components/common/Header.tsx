import { NavLink } from "react-router-dom"

import { ListMusic, ListPlus } from "lucide-react"

export function Header() {
  return (
    <>
      <h1 className="text-gray-200 text-3xl uppercase text-center p-6">
        <figure>
          <img
            src="./assets/logo.svg"
            alt="ChordBlocks logo"
            className="mx-auto"
            width={200}
          />
        </figure>
      </h1>
      <nav className="my-4">
        <ul className="flex gap-2">
          <li
            className="
              border-[.1px] 
              border-indigo-200/10
              rounded-md
              bg-indigo-200/5
              shadow-lg 
              hover:bg-indigo-600/20
              duration-300
              transition-all"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col rounded-md justify-center items-center py-2 px-4 ${
                  isActive ? "border-1 border-indigo-700" : ""
                }`
              }
            >
              <ListMusic className="text-indigo-700 mb-2" />
              <span className="text-indigo-700 text-xs font-bold uppercase">
                Song List
              </span>
            </NavLink>
          </li>
          <li
            className="
            border-[.1px] 
            border-indigo-200/10
            rounded-md
            bg-indigo-200/5
            shadow-lg 
            hover:bg-indigo-600/20
            duration-300
            transition-all
          "
          >
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `flex flex-col rounded-md justify-center items-center py-2 px-4 ${
                  isActive ? "border-1 border-indigo-700" : ""
                }`
              }
            >
              <ListPlus className="text-indigo-700 mb-2" />
              <span className="text-indigo-700 text-xs font-bold uppercase">
                Add Song
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
