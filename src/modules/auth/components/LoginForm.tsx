import { useState } from "react"
import { signIn } from "@/services/auth/supabaseAuth"
import { LogIn } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //prevent input empty submission
    if (email.trim() === "") {
      console.log("Email is required")
      return
    }

    await signIn(email)
    setSent(true)
  }

  if (sent) {
    return <p>Check your email!</p>
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-4 w-full"
    >
      <div className="w-full">
        <Input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@email.com"
          value={email}
        />
      </div>
      <div className="flex justify-end gap-2 w-full">
        <Dialog.Close asChild>
          <Button variant="cancel">Cancel</Button>
        </Dialog.Close>
        <Button
          variant="save"
          type="submit"
          className="flex items-center justify-center gap-2"
        >
          <LogIn size={16} /> Login
        </Button>
      </div>
    </form>
  )
}
