"use client";

import { useInView } from "@/hooks/useInView";
import { Eye, BarChart3, Shield, Clock, Link2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Eye,
    title: "Anonymous or authenticated",
    description:
      "Let anyone respond freely with anonymous mode, or require sign-in for verified responses. Toggle per poll.",
    stat: null,
  },
  {
    icon: BarChart3,
    title: "Live analytics dashboard",
    description:
      "Watch responses roll in as it happens. See per-question breakdowns, response timelines, and participation insights.",
    stat: null,
  },
  {
    icon: Link2,
    title: "One link, any platform",
    description:
      "Share your poll via email, social media, or embed anywhere. respondents land straight on your poll.",
    stat: null,
  },
  {
    icon: Clock,
    title: "Set an expiry date",
    description:
      "Auto-close polls when time's up. Perfect for live events, deadlines, or time-sensitive decisions.",
    stat: null,
  },
  {
    icon: Shield,
    title: "Anti-spam protection",
    description:
      "Cloudflare Turnstile blocks bots. Fingerprinting + cookie tracking prevents duplicate votes.",
    stat: null,
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Multiple people can view analytics simultaneously. Socket.io pushes live updates to all viewers.",
    stat: null,
  },
];

export function Features() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 max-w-xl transition-all duration-1000 ease-out",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for real feedback
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to ask, collect, and understand what your audience thinks.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={cn(
                "group relative transition-all duration-700 ease-out",
                inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
