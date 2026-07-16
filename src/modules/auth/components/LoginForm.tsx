import { useState } from "react"
import { signIn } from "@/services/auth/supabaseAuth"
import { LogIn } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email.trim() === "") {
      toast.error("Email is required")
      return
    }

    setSubmitting(true)
    try {
      await signIn(email.trim())
      setSent(true)
      toast.success("Check your email for the login link")
    } catch (err) {
      console.error("signIn error:", err)
      const message =
        err instanceof Error ? err.message : "Could not send login link"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
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
          disabled={submitting}
          className="flex items-center justify-center gap-2"
        >
          <LogIn size={16} /> Login
        </Button>
      </div>
    </form>
  )
}
