'use client';

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is it really anonymous?',
    a: "Yes. In anonymous mode, respondents don't need to sign in or provide any personal information. A random cookie prevents duplicate votes, but it's not linked to any identity. If you need verified responses, switch to authenticated mode instead.",
  },
  {
    q: 'How do you prevent spam and bots?',
    a: "We use Cloudflare Turnstile for invisible bot detection, SHA-256 fingerprinting to detect duplicate submissions from the same device, and respondent cookies as a final deduplication layer. No CAPTCHA puzzles - it's seamless for real users.",
  },
  {
    q: 'Do respondents need to install anything?',
    a: 'Not at all. Respondents just open the link in any browser. No app, no account, no sign-up required. It works on desktop and mobile.',
  },
  {
    q: 'Can I control when a poll closes?',
    a: "Yes. Every poll has an optional expiry date. Once it passes, the poll auto-closes and stops accepting responses. You can also publish results manually whenever you're ready.",
  },
  {
    q: 'Who can see the results?',
    a: "By default only you (the poll creator) can see results on the analytics dashboard. When you're ready, you can publish results so respondents can view them too.",
  },
];

function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-foreground"
      >
        <span className="font-heading text-base font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          open ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="text-base leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            'mb-16 max-w-xl transition-all duration-1000 ease-out',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          )}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions? We&apos;ve got answers.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to know about Opinion.
          </p>
        </div>

        <div
          className={cn(
            'mx-auto rounded-2xl border border-border/30 bg-card px-6 sm:px-10 transition-all duration-1000 ease-out',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          )}
        >
          {faqs.map((faq) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
