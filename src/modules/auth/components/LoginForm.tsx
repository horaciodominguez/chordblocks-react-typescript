import { useState } from "react"
import { signIn } from "@/services/auth/supabaseAuth"
import { LogIn } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email)
    setSent(true)
  }

  if (sent) {
    return <p>Check your email!</p>
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-2"
    >
      <input
        type="email"
        placeholder="email@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white  outline-0 w-full "
      />
      <button
        type="submit"
        className="flex justify-center items-center px-2 py-2 
                border-[.1px] border-zinc-700 rounded-md text-sm text-indigo-400 hover:text-gray-200 gap-2"
      >
        <LogIn />
        <span>Login</span>
      </button>
    </form>
  )
}
