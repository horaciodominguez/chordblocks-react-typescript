import { createRoot } from "react-dom/client"
import App from "@/App"
import { AuthProvider } from "@/modules/auth/context/AuthContext"
import { SongsProvider } from "@/modules/songs/context/SongsContext"
import { RepertoiresProvider } from "@/modules/repertoires/context/RepertoiresContext"

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SongsProvider>
      <RepertoiresProvider>
        <App />
      </RepertoiresProvider>
    </SongsProvider>
  </AuthProvider>,
)
