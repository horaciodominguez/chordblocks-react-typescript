import { useState } from "react"
import { Mail, LogIn, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { signIn } from "@/services/auth/supabaseAuth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const sendLink = async (target: string) => {
    setSubmitting(true)
    try {
      await signIn(target)
      setSentTo(target)
      toast.success("Login link sent")
    } catch (err) {
      console.error("signIn error:", err)
      const message =
        err instanceof Error ? err.message : "Could not send login link"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed === "") {
      toast.error("Email is required")
      return
    }
    await sendLink(trimmed)
  }

  if (sentTo) {
    return (
      <div
        className="
          flex flex-col gap-4
          rounded-md border border-zinc-700/80 bg-zinc-800/40 p-4
          light:border-zinc-200 light:bg-zinc-50
        "
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex items-center justify-center shrink-0
              min-h-11 min-w-11 rounded-full
              bg-indigo-500/15 text-indigo-300
              light:bg-indigo-100 light:text-indigo-700
            "
            aria-hidden
          >
            <Mail size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-zinc-100 light:text-zinc-900">
              Check your email
            </p>
            <p className="mt-1 text-sm text-zinc-400 light:text-zinc-600">
              We sent a login link to{" "}
              <span className="font-medium text-zinc-200 light:text-zinc-800 break-all">
                {sentTo}
              </span>
              . Open it on this device to finish signing in.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="cancel"
            disabled={submitting}
            onClick={() => {
              setSentTo(null)
              setEmail(sentTo)
            }}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft size={16} /> Use a different email
          </Button>
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => void sendLink(sentTo)}
            className="w-full sm:w-auto"
          >
            {submitting ? "Sending…" : "Resend link"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-3 w-full"
    >
      <label className="text-sm font-medium text-zinc-200 light:text-zinc-900">
        Email
      </label>
      <Input
        name="email"
        type="email"
        alwaysEditable
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        value={email}
        aria-label="Email"
        disabled={submitting}
      />
      <div className="flex justify-end">
        <Button
          variant="save"
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <LogIn size={16} />
          {submitting ? "Sending link…" : "Send login link"}
        </Button>
      </div>
    </form>
  )
}
