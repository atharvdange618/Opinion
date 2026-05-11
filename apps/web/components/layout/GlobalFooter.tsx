import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function GlobalFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-9 items-center rounded-md px-1 transition-opacity hover:opacity-90"
          >
            <BrandLogo className="h-7" />
          </Link>
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <a
            href="https://github.com/atharvdange618/Opinion"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
