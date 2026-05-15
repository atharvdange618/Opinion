'use client';

import { BarChart3, Eye, Share2 } from 'lucide-react';

import { useInView } from '@/hooks/useInView';

const features = [
  {
    className: 'sm:col-span-2 lg:col-span-1',
    description: 'Watch responses come in live. See charts and insights as they happen.',
    icon: BarChart3,
    iconBg: 'bg-primary/10 text-primary',
    title: 'Real-time analytics',
  },
  {
    className: '',
    description: 'One link is all you need. Share it anywhere - email, social, or embed.',
    icon: Share2,
    iconBg: 'bg-secondary text-secondary-foreground',
    title: 'Share with a link',
  },
  {
    className: '',
    description: 'Anonymous or authenticated responses. You control who participates.',
    icon: Eye,
    iconBg: 'bg-accent text-accent-foreground',
    title: 'Flexible privacy',
  },
];

export function AnimatedFeatures() {
  const { inView, ref } = useInView({ threshold: 0.15 });

  return (
    <section className="relative overflow-hidden px-4 py-20" ref={ref}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.68_0.1_25_/_0.03),transparent_70%)]" />
      <div className="mx-auto max-w-5xl">
        <h2
          className={`text-center font-heading text-3xl font-semibold transition-all duration-1000 ease-out ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          Everything you need
        </h2>
        <p
          className={`mt-2 text-center text-muted-foreground transition-all delay-150 duration-1000 ease-out ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          Create engaging polls in minutes
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              className={`rounded-xl border bg-card p-6 transition-all duration-1000 ease-out hover:-translate-y-1 hover:shadow-lg ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${feature.className}`}
              key={feature.title}
              style={{ transitionDelay: `${(i + 1) * 200}ms` }}
            >
              <div
                className={`mb-4 flex size-10 items-center justify-center rounded-lg ${feature.iconBg}`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
