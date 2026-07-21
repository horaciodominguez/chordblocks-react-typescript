import { Github, Linkedin, Globe } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-6 md:mt-10 py-3 md:py-6 text-center text-xs md:text-sm text-gray-400 relative light:text-zinc-600">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-indigo-700/0 via-indigo-600/100 via-20% to-indigo-900/0 light:via-indigo-400/50" />
      <div className="flex justify-center gap-6 mb-2 md:mb-3">
        <a
          href="https://github.com/horaciodominguez/chordblocks-react-typescript"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center light:hover:text-zinc-900"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com/in/horaciodominguez"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center light:hover:text-zinc-900"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="https://horaciodominguez.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio"
          className="hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center light:hover:text-zinc-900"
        >
          <Globe className="w-5 h-5" />
        </a>
      </div>

      <p className="text-[10px] md:text-sm">
        © {year} Horacio Dominguez ·{" "}
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          MIT License
        </a>
        {import.meta.env.DEV && (
          <>
            {" · "}
            <a href="/uitest" className="text-zinc-500 hover:text-zinc-300 light:text-zinc-500 light:hover:text-zinc-800">
              UI Test
            </a>
          </>
        )}
      </p>
    </footer>
  )
}
