import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "Opinion's privacy policy. Learn how we collect, use, and protect your data. We never sell your information and use only essential cookies.",
};

const sections = [
  { id: 'information', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Data' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'storage', label: 'Data Storage & Security' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'contact', label: 'Contact & Support' },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      icon={<ShieldCheck className="size-5 text-primary" />}
      badge="Legal"
      title="Privacy Policy"
      lastUpdated="May 2026"
      description="We believe in complete transparency about how we handle your data."
      sections={sections}
    >
      <section id="information" className="mb-14 scroll-mt-28">
        <SectionHeader num="01" title="Information We Collect" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          When you sign in using your identity provider, we receive your basic profile information
          including your <strong>name</strong> and <strong>email address</strong>. This information
          is used strictly to identify you within our platform and associate your account with the
          polls you create.
        </p>
        <p className="text-base leading-relaxed text-foreground">
          Poll responses may be collected anonymously or with authentication depending on the
          creator&apos;s configuration. We adhere to a strict <strong>no-sale policy</strong> your
          data is never sold to or shared with third-party advertisers.
        </p>
      </section>

      <section id="how-we-use" className="mb-14 scroll-mt-28">
        <SectionHeader num="02" title="How We Use Your Data" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          Your data powers the core functionality of Opinion. We use it exclusively to:
        </p>
        <ul className="mb-6 space-y-3">
          {[
            'Provide and maintain our polling service',
            'Securely authenticate your identity across sessions',
            'Generate and display accurate poll analytics and results',
            'Monitor platform health and improve user experience',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base text-foreground">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="third-party" className="mb-14 scroll-mt-28">
        <SectionHeader num="03" title="Third-Party Services" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          Opinion integrates with a minimal set of third-party services to operate securely and
          efficiently:
        </p>
        <div className="mb-4 space-y-4 rounded-xl border bg-muted/30 p-5">
          {[
            {
              name: 'Kleis IdP',
              purpose:
                'Handles authentication via the OpenID Connect protocol. We share only your name and email address for account creation.',
            },
            {
              name: 'Cloudflare Turnstile',
              purpose:
                'Provides bot detection on anonymous poll submissions. No personal data is shared with Cloudflare through this integration.',
            },
            {
              name: 'MongoDB Atlas',
              purpose:
                'Stores your account data and poll responses in an encrypted database. We self-host or use managed infrastructure at our discretion.',
            },
          ].map((service) => (
            <div key={service.name}>
              <h4 className="mb-1 text-sm font-semibold text-foreground">{service.name}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{service.purpose}</p>
            </div>
          ))}
        </div>
        <p className="text-base leading-relaxed text-foreground">
          Each of these providers has been vetted for compliance with modern data protection
          standards. We do not use advertising networks, analytics trackers, or social media pixels.
        </p>
      </section>

      <section id="storage" className="mb-14 scroll-mt-28">
        <SectionHeader num="04" title="Data Storage & Security" />
        <p className="text-base leading-relaxed text-foreground">
          We employ industry-standard security measures to protect your information. Your data is
          stored in encrypted databases with restricted access. We retain your information only for
          as long as your account remains active, plus a grace period of 90 days after account
          deletion to facilitate recovery. You maintain the right to request immediate erasure of
          your personal data at any time by contacting our support team.
        </p>
      </section>

      <section id="cookies" className="mb-14 scroll-mt-28">
        <SectionHeader num="05" title="Cookies & Tracking" />
        <p className="text-base leading-relaxed text-foreground">
          Opinion respects your digital footprint. We use a single, strictly necessary session
          cookie to maintain your authenticated state while using the application. We proudly
          operate without invasive tracking cookies, third-party analytics pixels, fingerprinting,
          or cross-site tracking mechanisms.
        </p>
      </section>

      <section id="rights" className="mb-14 scroll-mt-28">
        <SectionHeader num="06" title="Your Rights" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          You have full control over your personal data. Under applicable data protection laws, you
          are entitled to:
        </p>
        <ul className="space-y-3">
          {[
            'Right to access  request a copy of all data we hold about you',
            'Right to rectification  correct any inaccurate information',
            'Right to erasure  request permanent deletion of your account and associated data',
            'Right to data portability  export your data in a machine-readable format',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base text-foreground">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="scroll-mt-28">
        <SectionHeader num="07" title="Contact & Support" />
        <p className="text-base leading-relaxed text-foreground">
          If you have any concerns about our privacy practices, data handling, or wish to exercise
          your privacy rights, please reach out directly through our{' '}
          <a
            href="https://github.com/atharvdange618/Opinion/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GitHub repository issues page
          </a>
          . We&apos;re here to help.
        </p>
      </section>
    </LegalPageLayout>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-4">
      <span className="font-mono text-xs font-medium text-muted-foreground">{num}</span>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}
