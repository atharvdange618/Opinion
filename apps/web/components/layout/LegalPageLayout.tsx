import type { ReactNode } from 'react';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LegalPageLayoutProps {
  badge: string;
  children: ReactNode;
  description: string;
  icon: ReactNode;
  lastUpdated: string;
  sections: Section[];
  title: string;
}

interface Section {
  id: string;
  label: string;
}

export function LegalPageLayout({
  badge,
  children,
  description,
  icon,
  lastUpdated,
  sections,
  title,
}: LegalPageLayoutProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-[350px] w-[350px] rounded-full bg-chart-3/[0.02] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          className="group mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <header className="mb-16 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            {icon}
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {badge}
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
          <p className="mt-2 text-sm text-muted-foreground/70">Last updated: {lastUpdated}</p>
        </header>

        <div className="grid gap-16 lg:grid-cols-[1fr_220px] lg:gap-24">
          <article className="min-w-0">{children}</article>

          <aside className="hidden lg:block">
            <nav className="sticky top-28">
              <p className="mb-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                      href={`#${section.id}`}
                    >
                      <span className="size-1.5 rounded-full bg-muted-foreground/30 transition-colors group-hover:bg-primary" />
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </div>
  );
}
