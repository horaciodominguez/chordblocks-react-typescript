import { useState } from "react"
import { Mail, LogIn, ArrowLeft, KeyRound, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import {
  getAuthEmailRedirectTo,
  isPrivateNetworkOrigin,
  supabaseRedirectAllowlistHints,
} from "@/services/auth/authRedirect"
import { signIn, verifyEmailOtp } from "@/services/auth/supabaseAuth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const redirectHint = getAuthEmailRedirectTo()
  const onLan = redirectHint ? isPrivateNetworkOrigin(redirectHint) : false
  const allowlistHints = redirectHint
    ? supabaseRedirectAllowlistHints(redirectHint)
    : []

  const copyAllowlist = async () => {
    const text = allowlistHints.join("\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Redirect URLs copied")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy — select the URLs manually")
    }
  }

  const sendLink = async (target: string) => {
    setSubmitting(true)
    try {
      await signIn(target)
      setSentTo(target)
      setOtp("")
      toast.success(onLan ? "Code sent — use the 6-digit code" : "Login link sent")
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sentTo) return
    const code = otp.trim()
    if (code.length < 6) {
      toast.error("Enter the 6-digit code from the email")
      return
    }
    setSubmitting(true)
    try {
      await verifyEmailOtp(sentTo, code)
      toast.success("Signed in")
    } catch (err) {
      console.error("verifyOtp error:", err)
      const message =
        err instanceof Error ? err.message : "Invalid or expired code"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
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
        {onLan ? (
          <div
            className="
              rounded-md border border-amber-500/40 bg-amber-400/10 px-3 py-2
              text-sm text-amber-100 light:border-amber-300 light:bg-amber-50 light:text-amber-950
            "
          >
            <p className="font-semibold">On phone / LAN — do not tap the email link</p>
            <p className="mt-1 text-amber-100/90 light:text-amber-900">
              Supabase still has Site URL ={" "}
              <code className="text-xs">localhost:3000</code> (or your LAN host
              is not allowlisted), so the link will open the wrong host. Enter
              the <strong>6-digit code</strong> from the email here instead.
            </p>
          </div>
        ) : null}

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
              Sent to{" "}
              <span className="font-medium text-zinc-200 light:text-zinc-800 break-all">
                {sentTo}
              </span>
              .
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => void handleVerifyOtp(e)}
          className="flex flex-col gap-2"
        >
          <label
            htmlFor="login-otp"
            className="text-sm font-medium text-zinc-200 light:text-zinc-900"
          >
            6-digit code from email
          </label>
          <Input
            id="login-otp"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            alwaysEditable
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            aria-label="One-time login code"
            disabled={submitting}
            autoFocus={onLan}
          />
          <Button
            variant="save"
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-end"
          >
            <KeyRound size={16} />
            {submitting ? "Verifying…" : "Verify code"}
          </Button>
        </form>

        {onLan && redirectHint ? (
          <div className="rounded-md border border-zinc-700/60 px-3 py-2 text-xs text-zinc-400 light:border-zinc-200 light:text-zinc-600">
            <p className="font-medium text-zinc-300 light:text-zinc-800">
              To fix magic links later (Supabase dashboard)
            </p>
            <ol className="mt-1 list-decimal pl-4 space-y-1">
              <li>
                Authentication → URL Configuration → Site URL ={" "}
                <code>http://localhost:5173</code> (not :3000)
              </li>
              <li>Add these Redirect URLs:</li>
            </ol>
            <pre className="mt-2 overflow-x-auto rounded bg-zinc-950/50 p-2 text-[11px] text-zinc-300 light:bg-zinc-100 light:text-zinc-800">
              {allowlistHints.join("\n")}
            </pre>
            <p className="mt-2">
              Email template Confirm signup / Magic Link must use{" "}
              <code>{"{{ .RedirectTo }}"}</code>, not{" "}
              <code>{"{{ .SiteURL }}"}</code>.
            </p>
            <Button
              variant="secondary"
              type="button"
              onClick={() => void copyAllowlist()}
              className="mt-2 inline-flex items-center gap-1.5 min-h-9 text-xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Redirect URLs"}
            </Button>
          </div>
        ) : redirectHint ? (
          <p className="text-xs text-zinc-500 break-all">
            Magic link returns to: {redirectHint}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="cancel"
            disabled={submitting}
            onClick={() => {
              setSentTo(null)
              setEmail(sentTo)
              setOtp("")
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
            {submitting ? "Sending…" : "Resend"}
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
      {onLan ? (
        <p className="text-xs text-amber-200/90 light:text-amber-800">
          Testing on LAN ({redirectHint}). After you send the link, use the{" "}
          <strong>email code</strong> — do not open the magic link until
          Supabase Redirect URLs include this host.
        </p>
      ) : null}
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
          {submitting ? "Sending…" : onLan ? "Send login code" : "Send login link"}
        </Button>
      </div>
    </form>
  )
}
