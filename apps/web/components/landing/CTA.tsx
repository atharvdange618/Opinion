'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function CTA({ hasSession }: { hasSession: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            'relative flex flex-col items-start gap-8 overflow-hidden rounded-2xl bg-primary/[0.03] px-8 py-12 ring-1 ring-foreground/5 sm:flex-row sm:items-center sm:px-12 sm:py-16 lg:px-16 transition-all duration-1000 ease-out',
            inView ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.97] opacity-0',
          )}
        >
          <div className="flex-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
              Get started
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to ask your audience?
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Create a poll in under a minute. No setup required.
            </p>
          </div>
          <div className="shrink-0">
            <Button size="lg" asChild className="group/btn">
              <Link
                href={
                  hasSession
                    ? '/polls/create'
                    : `${API_URL}/api/auth/login?redirect=${encodeURIComponent('/polls/create')}`
                }
              >
                Create your first poll
                <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
