import { useState } from "react"
import { signIn } from "@/services/auth/supabaseAuth"

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
    <form onSubmit={handleSubmit} className="flex flex-col ">
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2 font-bold"
      >
        Login
      </button>
    </form>
  )
}
