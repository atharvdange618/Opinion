"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { PenLine, Share2, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "Create your poll",
    description:
      "Add questions, set anonymous or authenticated mode, pick an expiry. Takes under a minute.",
  },
  {
    icon: Share2,
    title: "Share the link",
    description:
      "One URL works everywhere - email, social, Slack, or embedded right on your page. No sign-up needed to respond.",
  },
  {
    icon: BarChart3,
    title: "Watch responses live",
    description:
      "Results appears as they come in. Per-question breakdowns, response timelines, and participation insights update in real time.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 max-w-xl transition-all duration-1000 ease-out",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps to insight
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From question to answers in no time. No account required for
            respondents.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{ transitionDelay: `${i * 200}ms` }}
              className={cn(
                "relative transition-all duration-700 ease-out",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {i < steps.length - 1 && (
                <div className="absolute left-12 top-8 hidden h-[calc(100%-1rem)] w-px md:block" />
              )}
              <div className="mb-6 flex size-24 items-center justify-center rounded-2xl bg-primary/[0.04] ring-1 ring-primary/10">
                <span className="relative flex size-24 items-center justify-center">
                  <step.icon className="size-10 text-primary" />
                  <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                </span>
              </div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
