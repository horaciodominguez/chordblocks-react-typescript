import { signOut } from "@/services/auth/supabaseAuth"

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 text-white rounded px-4 py-2 font-bold cursor-pointer"
    >
      Sign Out
    </button>
  )
}
