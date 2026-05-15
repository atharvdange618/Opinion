'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';

const chartData = [
  { option: 'Turborepo', votes: 58 },
  { option: 'Nx', votes: 42 },
  { option: 'pnpm workspaces', votes: 40 },
  { option: 'Lerna', votes: 28 },
  { option: 'Rush', votes: 26 },
];

const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

export function Hero({ apiUrl, hasSession }: { apiUrl: string; hasSession: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pb-32 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-chart-3/[0.02] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-16 lg:grid-cols-2">
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            <h1 className="font-heading text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight text-foreground">
              Ask anonymously. <span className="text-primary">Get honest answers.</span>
            </h1>
            <p
              className={`mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground transition-all delay-200 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              Create polls, share them with a link, and watch responses come in live. Anonymous or
              authenticated, anti-spam protected, real-time analytics.
            </p>
            <div
              className={`mt-10 flex flex-wrap items-center gap-4 transition-all delay-[400ms] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <Button asChild className="group/btn" size="lg">
                <Link
                  href={
                    hasSession
                      ? '/polls/create'
                      : `${apiUrl}/api/auth/login?redirect=${encodeURIComponent('https://opinion.atharvdangedev.in/polls/create')}`
                  }
                >
                  <span className="flex items-center">
                    Create your first poll
                    <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-active/btn:scale-95">
                      <ArrowUpRight className="size-3.5" weight="bold" />
                    </span>
                  </span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href={hasSession ? '/dashboard' : `${apiUrl}/api/auth/login`}>
                  {hasSession ? 'Go to dashboard' : 'Sign in'}
                </Link>
              </Button>
            </div>
          </div>

          <div
            className={`hidden lg:block transition-all delay-300 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-16 scale-[0.95] opacity-0'
            }`}
          >
            <div className="rounded-[2rem] bg-black/[0.03] p-[5px] ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              <div className="rounded-[calc(2rem-5px)] bg-card p-6 shadow-lg ring-1 ring-foreground/5">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Live results
                </p>
                <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">
                  Your preferred monorepo tool?
                </h3>
                <div className="h-[220px]">
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart
                      barCategoryGap="30%"
                      data={chartData}
                      margin={{ bottom: 0, left: -20, right: 4, top: 4 }}
                    >
                      <CartesianGrid
                        stroke="var(--color-border)"
                        strokeDasharray="4 4"
                        strokeOpacity={0.4}
                        vertical={false}
                      />
                      <XAxis
                        axisLine={false}
                        dataKey="option"
                        tick={{
                          fill: 'var(--color-muted-foreground)',
                          fontSize: 12,
                        }}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        tick={{
                          fill: 'var(--color-muted-foreground)',
                          fontSize: 11,
                        }}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ opacity: 0.08 }} />
                      <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell fill={CHART_COLORS[i % CHART_COLORS.length]} key={i} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block size-1.5 rounded-full bg-primary/60" />
                  194 responses &middot; updated just now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: { value: number }[];
}) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">{payload[0]!.value} responses</p>
      </div>
    );
  }
  return null;
}
