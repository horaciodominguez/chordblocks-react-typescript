import { NavLink } from "react-router-dom"

import { ListMusic, ListPlus } from "lucide-react"

const navLinks = [
  { to: "/", label: "Song List", icon: ListMusic },
  { to: "/new", label: "Add Song", icon: ListPlus },
]

export default function Nav() {
  return (
    <nav className="my-4">
      <ul className="flex gap-2">
        {navLinks.map((link) => {
          const NavLinkIcon = link.icon
          return (
            <li
              key={link.to}
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
                to={link.to}
                aria-label={link.label}
                className={({ isActive }) =>
                  `flex flex-col rounded-md justify-center items-center py-2 px-4 ${
                    isActive ? "border-1 border-indigo-700" : ""
                  }`
                }
              >
                <NavLinkIcon className="text-indigo-700 mb-2" />
                <span className="text-indigo-700 text-xs font-bold uppercase">
                  {link.label}
                </span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
