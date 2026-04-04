import { Code, Globe, Mail } from "lucide-react";

export function NetflixFooter() {
  return (
    <footer className="bg-bg border-t border-border py-xl px-[4vw]">
      <div className="flex flex-col items-center gap-lg">
        <div className="flex gap-xl">
          <a
            href="https://github.com/Misrilal-Sah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
            aria-label="GitHub"
          >
            <Code size={20} />
          </a>
          <a
            href="https://linkedin.com/in/misrilal-sah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
            aria-label="LinkedIn"
          >
            <Globe size={20} />
          </a>
          <a
            href="mailto:misrilalsah09@gmail.com"
            className="text-text-muted hover:text-text transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
        <p className="text-text-dim text-[length:var(--font-size-body)]">
          &copy; {new Date().getFullYear()} Misril.dev
        </p>
      </div>
    </footer>
  );
}
