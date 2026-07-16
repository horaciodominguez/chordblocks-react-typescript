import { createRoot } from "react-dom/client"
import App from "@/App"
import { AuthProvider } from "@/modules/auth/context/AuthContext"
import { SongsProvider } from "@/modules/songs/context/SongsContext"

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SongsProvider>
      <App />
    </SongsProvider>
  </AuthProvider>,
)
