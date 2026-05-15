import Link from 'next/link';

import { BrandLogo } from '@/components/layout/BrandLogo';

export function GlobalFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Link
            className="flex h-9 items-center rounded-md px-1 transition-opacity hover:opacity-90"
            href="/"
          >
            <BrandLogo className="h-7" />
          </Link>
          <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()}</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link className="hover:text-foreground transition-colors" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground transition-colors" href="/terms">
            Terms
          </Link>
          <a
            className="hover:text-foreground transition-colors"
            href="https://github.com/atharvdange618/Opinion"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
