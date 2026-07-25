import { createRoot } from "react-dom/client"
import { bootstrapTheme } from "@/modules/ui/themePreference"
import App from "@/App"
import { AuthProvider } from "@/modules/auth/context/AuthContext"
import { SongsProvider } from "@/modules/songs/context/SongsContext"
import { RepertoiresProvider } from "@/modules/repertoires/context/RepertoiresContext"
import { GigLockProvider } from "@/modules/repertoires/context/GigLockContext"

bootstrapTheme()

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SongsProvider>
      <RepertoiresProvider>
        <GigLockProvider>
          <App />
        </GigLockProvider>
      </RepertoiresProvider>
    </SongsProvider>
  </AuthProvider>,
)
