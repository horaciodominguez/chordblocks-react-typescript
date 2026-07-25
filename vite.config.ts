/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import * as path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    // LAN access for phone testing (Network URL in `npm run dev`)
    host: true,
    port: 5173,
    // Don't silently jump to 5174/5175 — stale tabs then fetch dead ports (chunk errors).
    strictPort: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
