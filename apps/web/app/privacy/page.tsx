import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Opinion's privacy policy. Learn how we collect, use, and protect your data. We never sell your information and use only essential cookies.",
};

const sections = [
  { id: "information", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Data" },
  { id: "storage", label: "Data Storage & Security" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "contact", label: "Contact & Support" },
];

export default function PrivacyPage() {
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
            <ShieldCheck className="size-5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Legal
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Last updated: May 2025. We believe in complete transparency about
            how we handle your data.
          </p>
        </header>

        <div className="grid gap-16 lg:grid-cols-[1fr_200px] lg:gap-24">
          <article className="prose">
            <section id="information" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  01
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Information We Collect
                </h2>
              </div>
              <p className="mb-4 text-base leading-relaxed text-foreground">
                When you sign in using your identity provider, we receive your
                basic profile information including your <strong>name</strong>{" "}
                and <strong>email address</strong>. This information is used
                strictly to identify you within our platform and associate your
                account with the polls you create.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                Poll responses may be collected anonymously or with
                authentication depending on the creator&apos;s configuration. We
                adhere to a strict <strong>no-sale policy</strong> - your data
                is never sold to or shared with third-party advertisers.
              </p>
            </section>

            <section id="how-we-use" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  02
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  How We Use Your Data
                </h2>
              </div>
              <p className="mb-4 text-base leading-relaxed text-foreground">
                Your data powers the core functionality of Opinion. We use it
                exclusively to:
              </p>
              <ul className="mb-4 space-y-3">
                {[
                  "Provide and maintain our polling service",
                  "Securely authenticate your identity across sessions",
                  "Generate and display accurate poll analytics and results",
                  "Monitor platform health and improve user experience",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base text-foreground"
                  >
                    <span className="mt-2 size-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="storage" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  03
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Data Storage & Security
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                We employ industry-standard security measures to protect your
                information. Your data is stored securely in encrypted
                databases. We retain your information only for as long as your
                account remains active. You maintain the right to request a
                complete deletion of your personal data at any time by
                contacting our support team.
              </p>
            </section>

            <section id="cookies" className="mb-12 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  04
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Cookies & Tracking
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                Opinion respects your digital footprint. We use a single,
                strictly necessary session cookie to maintain your authenticated
                state while using the application. We proudly operate without
                invasive tracking cookies, third-party analytics pixels, or
                cross-site tracking mechanisms.
              </p>
            </section>

            <section id="contact" className="scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium text-muted-foreground">
                  05
                </span>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Contact & Support
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                If you have any concerns about our privacy practices, data
                handling, or wish to exercise your privacy rights, please reach
                out directly through our GitHub repository issues page.
                We&apos;re here to help.
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
