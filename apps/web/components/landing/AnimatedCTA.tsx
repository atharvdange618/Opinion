"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function AnimatedCTA({ hasSession }: { hasSession: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.3 });

  return (
    <section className="relative overflow-hidden px-4 py-20" ref={ref}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,oklch(0.68_0.1_25_/_0.04),transparent_70%)]" />
      <div
        className={`mx-auto max-w-3xl text-center transition-all duration-1000 ease-out ${
          inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.97] opacity-0"
        }`}
      >
        <h2 className="font-heading text-3xl font-semibold">
          Ready to get started?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Create your first poll in seconds. No credit card required.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
              <Link
                href={
                  hasSession
                    ? "/polls/create"
                    : `${API_URL}/api/auth/login?redirect=${encodeURIComponent("/polls/create")}`
                }
              >
              Create your first poll
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
