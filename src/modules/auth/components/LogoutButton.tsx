import Button from "@/components/ui/Button"
import { signOut } from "@/services/auth/supabaseAuth"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button
      variant="delete"
      onClick={() => signOut()}
      className="flex items-center justify-center gap-2  "
    >
      <LogOut size={16} /> Sign Out
    </Button>
  )
}
