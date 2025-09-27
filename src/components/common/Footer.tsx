import { Github, Linkedin, Globe } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-10 border-t border-gray-700 py-6 text-center text-sm text-gray-400">
      <div className="flex justify-center gap-6 mb-3">
        <a
          href="https://github.com/horaciodominguez/chordblocks-react-typescript"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com/in/horaciodominguez"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-white transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="https://horaciodominguez.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio"
          className="hover:text-white transition-colors"
        >
          <Globe className="w-5 h-5" />
        </a>
      </div>

      {/* License + year */}
      <p>
        © {year} Horacio Dominguez ·{" "}
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          MIT License
        </a>
      </p>
    </footer>
  )
}
