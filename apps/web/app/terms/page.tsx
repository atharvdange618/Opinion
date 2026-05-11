import type { Metadata } from "next";
import { Scale } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Opinion",
};

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "content", label: "User Content & Ownership" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "modifications", label: "Modifications to Terms" },
];

const prohibitedUses = [
  "Distributing malicious content, spam, or phishing links",
  "Harassing, abusing, or impersonating other individuals",
  "Violating local, state, national, or international laws",
  "Attempting to exploit or disrupt our infrastructure",
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <header className="mb-16 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Scale className="size-5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Legal
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The rules of the road. Please read these terms carefully before using
            Opinion.
          </p>
        </header>

        <div className="grid gap-16 lg:grid-cols-[1fr_200px] lg:gap-24">
          <article className="prose">
            <section id="acceptance" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  01
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Acceptance of Terms
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                By accessing and using Opinion, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service. If you
                do not agree with any part of these terms, you must discontinue your
                use of our platform immediately.
              </p>
            </section>

            <section id="acceptable-use" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  02
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Acceptable Use
                </h2>
              </div>
              <p className="mb-4 text-base leading-relaxed text-foreground">
                Opinion empowers you to create, distribute, and analyze polls. To
                maintain a safe environment, you agree{" "}
                <strong>not</strong> to use the service for:
              </p>
              <ul className="mb-4 space-y-3">
                {prohibitedUses.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-foreground">
                    <span className="mt-2 size-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="content" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  03
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  User Content & Ownership
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                You retain full ownership of all polls, questions, and content you
                create on the platform. However, by publishing a poll, you grant
                Opinion a worldwide, royalty-free license to host, display, and
                distribute that content strictly for the purpose of operating the
                service. You are solely responsible for ensuring you have the right
                to publish your content.
              </p>
            </section>

            <section id="liability" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  04
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Limitation of Liability
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                Opinion is provided on an{" "}
                <span className="italic">&ldquo;as is&rdquo;</span> and{" "}
                <span className="italic">&ldquo;as available&rdquo;</span> basis without
                any warranties, express or implied. We do not guarantee uninterrupted
                access or perfectly accurate analytics. In no event shall Opinion or
                its maintainers be held liable for any direct, indirect, incidental,
                or consequential damages resulting from your use of the platform.
              </p>
            </section>

            <section id="modifications" className="scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  05
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Modifications to Terms
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                We reserve the right to update or modify these Terms of Service at
                any time. Significant changes will be communicated through the
                platform. Your continued use of Opinion following any updates
                constitutes your acceptance of the revised terms.
              </p>
            </section>
          </article>

          <aside className="hidden lg:block">
            <nav className="sticky top-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-2">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="tabular-nums font-mono text-xs opacity-50 group-hover:opacity-100">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="border-l-2 border-transparent pl-2 transition-colors group-hover:border-foreground/20">
                        {section.label}
                      </span>
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
