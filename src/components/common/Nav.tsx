import { NavLink, useLocation } from "react-router-dom"
import { NAV_ITEMS, isNavItemActive } from "@/config/navigation"

export default function Nav() {
  const location = useLocation()

  return (
    <nav className="hidden md:block" aria-label="Desktop navigation">
      <ul className="flex justify-end items-end">
        {NAV_ITEMS.map((link) => {
          const NavLinkIcon = link.icon
          const active = isNavItemActive(link, location.pathname)
          return (
            <li key={link.id}>
              <NavLink
                to={link.to}
                end={link.end}
                aria-current={active ? "page" : undefined}
                className={`flex flex-row rounded-md px-4 py-2 justify-center items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  active ? "bg-indigo-600/20" : ""
                }`}
              >
                <NavLinkIcon className="text-indigo-200 mr-1" size={16} />
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
