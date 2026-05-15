import type { Metadata } from 'next';

import { Scale } from 'lucide-react';

import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  description:
    "Opinion's terms of service. By using Opinion you agree to these terms covering acceptable use, content ownership, and liability limitations.",
  title: 'Terms of Service',
};

const sections = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'acceptable-use', label: 'Acceptable Use' },
  { id: 'content', label: 'User Content & Ownership' },
  { id: 'termination', label: 'Termination' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'modifications', label: 'Modifications to Terms' },
];

const prohibitedUses = [
  'Distributing malicious content, spam, or phishing links',
  'Harassing, abusing, or impersonating other individuals',
  'Violating local, state, national, or international laws',
  'Attempting to exploit or disrupt our infrastructure',
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      description="The rules of the road. Please read these terms carefully before using Opinion."
      icon={<Scale className="size-5 text-primary" />}
      lastUpdated="May 2026"
      sections={sections}
      title="Terms of Service"
    >
      <section className="mb-14 scroll-mt-28" id="acceptance">
        <SectionHeader num="01" title="Acceptance of Terms" />
        <p className="text-base leading-relaxed text-foreground">
          By accessing and using Opinion, you acknowledge that you have read, understood, and agree
          to be bound by these Terms of Service. If you do not agree with any part of these terms,
          you must discontinue your use of our platform immediately.
        </p>
      </section>

      <section className="mb-14 scroll-mt-28" id="acceptable-use">
        <SectionHeader num="02" title="Acceptable Use" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          Opinion empowers you to create, distribute, and analyze polls. To maintain a safe
          environment, you agree <strong>not</strong> to use the service for:
        </p>
        <ul className="mb-6 space-y-3">
          {prohibitedUses.map((item) => (
            <li className="flex items-start gap-3 text-base text-foreground" key={item}>
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-destructive" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14 scroll-mt-28" id="content">
        <SectionHeader num="03" title="User Content & Ownership" />
        <p className="mb-4 text-base leading-relaxed text-foreground">
          You retain full ownership of all polls, questions, and content you create on the platform.
          However, by publishing a poll, you grant Opinion a worldwide, royalty-free license to
          host, display, and distribute that content strictly for the purpose of operating the
          service.
        </p>
        <p className="text-base leading-relaxed text-foreground">
          You represent and warrant that your content does not infringe on the intellectual property
          rights of any third party. You are solely responsible for ensuring you have the right to
          publish your content. We reserve the right to remove content that violates these terms or
          applicable law.
        </p>
      </section>

      <section className="mb-14 scroll-mt-28" id="termination">
        <SectionHeader num="04" title="Termination" />
        <p className="text-base leading-relaxed text-foreground">
          We reserve the right to suspend or terminate access to the platform for any user who
          violates these terms or engages in behavior that compromises the security or integrity of
          the service. You may delete your account at any time through the dashboard or by
          contacting support. Upon termination, your data will be permanently deleted within 90 days
          unless retention is required by law.
        </p>
      </section>

      <section className="mb-14 scroll-mt-28" id="liability">
        <SectionHeader num="05" title="Limitation of Liability" />
        <p className="text-base leading-relaxed text-foreground">
          Opinion is provided on an <span className="italic">&ldquo;as is&rdquo;</span> and{' '}
          <span className="italic">&ldquo;as available&rdquo;</span> basis without any warranties,
          express or implied. We do not guarantee uninterrupted access or perfectly accurate
          analytics. In no event shall Opinion or its maintainers be held liable for any direct,
          indirect, incidental, or consequential damages resulting from your use of the platform.
        </p>
      </section>

      <section className="mb-14 scroll-mt-28" id="governing-law">
        <SectionHeader num="06" title="Governing Law" />
        <p className="text-base leading-relaxed text-foreground">
          These terms shall be governed by and construed in accordance with the laws of India. Any
          disputes arising out of or relating to these terms or your use of the platform shall be
          resolved through informal negotiation before any legal action is pursued.
        </p>
      </section>

      <section className="scroll-mt-28" id="modifications">
        <SectionHeader num="07" title="Modifications to Terms" />
        <p className="text-base leading-relaxed text-foreground">
          We reserve the right to update or modify these Terms of Service at any time. Significant
          changes will be communicated through the platform or via the email address associated with
          your account. Your continued use of Opinion following any updates constitutes your
          acceptance of the revised terms.
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
