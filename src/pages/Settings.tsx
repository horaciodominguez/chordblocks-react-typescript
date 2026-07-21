import { useSearchParams } from "react-router-dom"
import { User } from "lucide-react"
import PageTitle from "@/components/ui/PageTitle"
import SegmentedTabs from "@/components/ui/SegmentedTabs"
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

      <SegmentedTabs
        className="mb-6"
        aria-label="Settings sections"
        items={TABS}
        value={tab}
        onChange={(id) => setTab(id as TabId)}
        getTabId={(id) => `settings-tab-${id}`}
        getPanelId={(id) => `settings-panel-${id}`}
      />

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
