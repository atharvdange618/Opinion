'use client';

import { useInView } from '@/hooks/useInView';
import { BarChart3, Eye, Clock, Link2, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: BarChart3,
    title: 'Live analytics dashboard',
    description:
      'Watch responses roll in as they happen. Per-question breakdowns, response timelines, and participation insights update in real time.',
  },
  {
    icon: Link2,
    title: 'One link, any platform',
    description: 'Share via email, social media, or embed. Respondents land straight on your poll.',
  },
  {
    icon: Eye,
    title: 'Anonymous or authenticated',
    description:
      'Let anyone respond freely with anonymous mode, or require sign-in for verified responses.',
  },
  {
    icon: Clock,
    title: 'Set an expiry date',
    description:
      'Auto close polls on your schedule. Ideal for live events, deadlines, and time sensitive decisions.',
  },
  {
    icon: Shield,
    title: 'Anti-spam protection',
    description:
      'Cloudflare Turnstile blocks bots. Fingerprinting and cookie tracking prevent duplicate votes.',
  },
  {
    icon: Users,
    title: 'Real-time collaboration',
    description: 'Multiple people can watch analytics simultaneously with live Socket.IO updates.',
  },
];

export function Features() {
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
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for real feedback
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to ask, collect, and understand what your audience thinks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div
            style={{ transitionDelay: '0ms' }}
            className={cn(
              'col-span-1 overflow-hidden rounded-2xl border border-border/50 bg-primary/[0.02] p-8 transition-all duration-700 ease-out sm:p-10 lg:col-span-2',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <BarChart3 className="size-6" />
            </div>
            <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
              {features[0].title}
            </h3>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              {features[0].description}
            </p>
          </div>

          <div
            style={{ transitionDelay: '100ms' }}
            className={cn(
              'col-span-1 rounded-2xl border border-border/30 bg-card p-6 transition-all duration-700 ease-out sm:p-8',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Link2 className="size-5" />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
              {features[1].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {features[1].description}
            </p>
          </div>

          <div
            style={{ transitionDelay: '200ms' }}
            className={cn(
              'col-span-1 rounded-2xl border border-border/30 bg-card p-6 transition-all duration-700 ease-out sm:p-8',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Eye className="size-5" />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
              {features[2].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {features[2].description}
            </p>
          </div>

          <div
            style={{ transitionDelay: '300ms' }}
            className={cn(
              'col-span-1 rounded-2xl border border-border/30 bg-card p-6 transition-all duration-700 ease-out sm:p-8',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Clock className="size-5" />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
              {features[3].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {features[3].description}
            </p>
          </div>

          <div
            style={{ transitionDelay: '400ms' }}
            className={cn(
              'col-span-1 rounded-2xl border border-border/30 bg-card p-6 transition-all duration-700 ease-out sm:p-8',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Shield className="size-5" />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
              {features[4].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {features[4].description}
            </p>
          </div>

          <div
            style={{ transitionDelay: '500ms' }}
            className={cn(
              'col-span-1 overflow-hidden rounded-2xl border border-border/50 bg-primary/[0.02] p-8 transition-all duration-700 ease-out sm:p-10 lg:col-span-3',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Users className="size-6" />
            </div>
            <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
              {features[5].title}
            </h3>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              {features[5].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
