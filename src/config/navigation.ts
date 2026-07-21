import { Home, ListMusic, Library, Settings, type LucideIcon } from "lucide-react"

export type NavItemId = "home" | "songs" | "sets" | "settings"

export type NavItem = {
  id: NavItemId
  to: string
  label: string
  icon: LucideIcon
  /** Exact match for NavLink `end` */
  end: boolean
  /** Paths that should mark this tab active */
  matchPrefixes: string[]
}

export const ROUTES = {
  home: "/",
  songs: "/songs",
  newSong: "/new",
  song: (id: string) => `/song/${id}`,
  songEdit: (id: string) => `/song/${id}/edit`,
  sets: "/repertoires",
  set: (id: string) => `/repertoires/${id}`,
  setEdit: (id: string) => `/repertoires/${id}/edit`,
  settings: "/settings",
  settingsAccount: "/settings?tab=account",
} as const

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    to: ROUTES.home,
    label: "Home",
    icon: Home,
    end: true,
    matchPrefixes: ["/"],
  },
  {
    id: "songs",
    to: ROUTES.songs,
    label: "Songs",
    icon: ListMusic,
    end: false,
    matchPrefixes: ["/songs", "/song", "/new"],
  },
  {
    id: "sets",
    to: ROUTES.sets,
    label: "Sets",
    icon: Library,
    end: false,
    matchPrefixes: ["/repertoires"],
  },
  {
    id: "settings",
    to: ROUTES.settings,
    label: "Settings",
    icon: Settings,
    end: false,
    matchPrefixes: ["/settings"],
  },
]

/** Returns whether a nav item should appear active for the given pathname. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.id === "home") {
    return pathname === ROUTES.home
  }
  return item.matchPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function isEditPath(pathname: string): boolean {
  return (
    pathname === ROUTES.newSong ||
    /^\/song\/[^/]+\/edit$/.test(pathname) ||
    /^\/repertoires\/[^/]+\/edit$/.test(pathname)
  )
}
