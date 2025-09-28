import { NavLink } from "react-router-dom"

import { LayoutDashboard, ListMusic, ListPlus } from "lucide-react"

const navLinks = [
  { to: "/", label: "Song List", icon: ListMusic },
  { to: "/new", label: "Add Song", icon: ListPlus },
  { to: "/uitest", label: "UI Test", icon: LayoutDashboard },
]

export default function Nav() {
  return (
    <nav className="">
      <ul className="flex justify-end items-end ">
        {navLinks.map((link) => {
          const NavLinkIcon = link.icon
          return (
            <li
              key={link.to}
              className="
              "
            >
              <NavLink
                to={link.to}
                aria-label={link.label}
                className={({ isActive }) =>
                  `flex flex-row rounded-md px-4 py-2 justify-center items-center ${
                    isActive ? "bg-indigo-600/20" : ""
                  }`
                }
              >
                <NavLinkIcon className="text-indigo-200 mr-1  " size={16} />
                <span className="text-indigo-400 text-[10px] uppercase">
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
