"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Users, BookOpen, Calendar } from "lucide-react";

const cases = [
  {
    icon: Users,
    title: "Team retrospectives",
    description:
      "Run anonymous sprint retros where everyone speaks freely. Get honest, actionable feedback without the awkward silence.",
  },
  {
    icon: BookOpen,
    title: "Classrooms & workshops",
    description:
      "Quiz students, collect Q&A, and gauge understanding mid-session. See what lands and what doesn't, instantly.",
  },
  {
    icon: Calendar,
    title: "Events & communities",
    description:
      "Run live polls at meetups, conferences, or community discussions. Share a link and watch the room respond in real time.",
  },
];

export function UseCases() {
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
            Use cases
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fits the way you work
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Whether you&apos;re leading a team, teaching a class, or running an
            event - Opinion adapts.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((item, i) => (
            <div
              key={item.title}
              style={{ transitionDelay: `${i * 200}ms` }}
              className={cn(
                "group rounded-2xl border border-border/30 bg-card p-8 transition-all duration-700 ease-out hover:border-border/60 hover:shadow-sm sm:p-10",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/25">
                <item.icon className="size-6" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
