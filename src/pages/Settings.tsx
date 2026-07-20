import { useSearchParams } from "react-router-dom"
import { User } from "lucide-react"
import PageTitle from "@/components/ui/PageTitle"
import { DataTransferPanel } from "@/modules/io/components/DataTransferPanel"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LogoutButton } from "@/modules/auth/components/LogoutButton"

const TABS = [
  { id: "data", label: "Data" },
  { id: "account", label: "Account" },
] as const

type TabId = (typeof TABS)[number]["id"]

function isTabId(v: string | null): v is TabId {
  return TABS.some((t) => t.id === v)
}

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const { user } = useAuth()
  const rawTab = params.get("tab")
  const tab: TabId = isTabId(rawTab) ? rawTab : "data"

  const setTab = (next: TabId) => {
    setParams(next === "data" ? {} : { tab: next }, { replace: true })
  }

  return (
    <>
      <PageTitle>Settings</PageTitle>

      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex gap-1 mb-6 p-1 rounded-lg bg-zinc-900/80 border border-zinc-800"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            id={`settings-tab-${t.id}`}
            aria-controls={`settings-panel-${t.id}`}
            className={`flex-1 min-h-11 rounded-md text-sm uppercase tracking-wide transition-colors ${
              tab === t.id
                ? "bg-indigo-600/30 text-indigo-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "data" ? (
        <div
          role="tabpanel"
          id="settings-panel-data"
          aria-labelledby="settings-tab-data"
          className="panel-variant-1"
        >
          <DataTransferPanel />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="settings-panel-account"
          aria-labelledby="settings-tab-account"
          className="panel-variant-1 flex flex-col gap-4"
        >
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center min-h-11 min-w-11 rounded-full bg-zinc-800">
                  <User size={20} className="text-indigo-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{user.email}</p>
                  <p className="text-xs text-zinc-500">Signed in</p>
                </div>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-400">
                Sign in to sync songs and sets across devices.
              </p>
              <LoginForm />
            </>
          )}
        </div>
      )}
    </>
  )
}
