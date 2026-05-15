'use client';

import type { AnalyticsData } from '@opinion/shared';

import {
  ActivityIcon,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  ShareNetwork,
  Shield,
  ShieldCheck,
  TrendDown,
  Users,
} from '@phosphor-icons/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from '@/components/Charts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  return i < 12 ? `${h}AM` : `${h}PM`;
});

function formatHoursAgo(hours: number): string {
  if (hours < 1) return '< 1h ago';
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [publishing, setPublishing] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    document.title = 'Analytics - Opinion';
  }, []);

  const { data: analytics, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await api.get<AnalyticsData>(`/polls/${id}/analytics`);
      return data;
    },
    queryKey: ['analytics', id],
  });

  const { data: poll } = useQuery({
    queryFn: async () => {
      const { data } = await api.get(`/polls/${id}`);
      return data;
    },
    queryKey: ['poll', id],
  });

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join:poll', id);

    socket.on('analytics:update', () => {
      void queryClient.invalidateQueries({ queryKey: ['analytics', id] });
    });

    return () => {
      socket.emit('leave:poll', id);
      socket.off('analytics:update');
    };
  }, [id, queryClient]);

  async function handlePublish() {
    setPublishing(true);
    try {
      await api.put(`/polls/${id}/publish`);
      void queryClient.invalidateQueries({ queryKey: ['poll', id] });
      toast.success('Results published');
    } catch {
      toast.error('Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  function handleCopyLink() {
    if (!poll?.slug) return;
    setCopying(true);

    const url = `${globalThis.location.origin}/poll/${poll.slug}`;

    function done(success: boolean) {
      if (success) {
        toast.success('Link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
      setTimeout(() => setCopying(false), 1200);
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => done(true),
        () => done(false),
      );
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      done(document.execCommand('copy'));
      textarea.remove();
    }
  }

  const anonPercent = useMemo(() => {
    if (!analytics || analytics.totalResponses === 0) return 0;
    return Math.round((analytics.participationInsights.anonymous / analytics.totalResponses) * 100);
  }, [analytics]);

  const authPercent = 100 - anonPercent;

  const peakHour = analytics?.engagement.peakActivity.hour ?? null;
  const peakDay = analytics?.engagement.peakActivity.dayOfWeek ?? null;
  const peakTime =
    peakHour === null
      ? null
      : `${HOURS[peakHour]}${peakDay === null ? '' : ' on ' + DAYS[peakDay]}`;

  const totalQuestions = analytics?.questionSummaries.length ?? 0;
  const maxVotes = analytics?.pollHealth.votesPerQuestion
    ? Math.max(...analytics.pollHealth.votesPerQuestion.map((q) => q.totalAnswers))
    : 0;

  const dropOff =
    totalQuestions > 1 && maxVotes > 0
      ? Math.round(
          ((maxVotes -
            (analytics?.pollHealth.votesPerQuestion?.[totalQuestions - 1]?.totalAnswers ?? 0)) /
            maxVotes) *
            100,
        )
      : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Skeleton className="mb-4 h-10 w-72" />
        <div className="mb-16 grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton className="h-28 rounded-2xl" key={i} />
          ))}
        </div>
        <Skeleton className="mb-8 h-72 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {poll?.title || 'Poll Analytics'}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  poll?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                }`}
              />
              {poll?.status}
            </span>
            <span className="text-muted-foreground/30">/</span>
            <a
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              href={`/poll/${poll?.slug}`}
            >
              <ArrowUpRight className="size-3" weight="bold" />
              /poll/{poll?.slug}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={copying} onClick={handleCopyLink} variant="outline">
            {copying ? (
              <CheckCircle className="mr-2 size-4 text-success" weight="bold" />
            ) : (
              <Copy className="mr-2 size-4" weight="bold" />
            )}
            Copy link
          </Button>
          {poll?.status !== 'published' && (
            <Button
              disabled={publishing}
              onClick={() => {
                void handlePublish();
              }}
            >
              <ShareNetwork className="mr-2 size-4" weight="bold" />
              {publishing ? 'Publishing' : 'Publish results'}
            </Button>
          )}
        </div>
      </header>

      <section className="mb-16">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 sm:grid-cols-12">
          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-5">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4" weight="bold" />
              Total Responses
            </p>
            <p className="mt-2 font-heading text-5xl font-semibold tabular-nums tracking-tight text-foreground">
              {analytics?.totalResponses ?? 0}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3" weight="bold" />
                {analytics?.participationInsights.anonymous ?? 0} anonymous
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3" weight="bold" />
                {analytics?.participationInsights.authenticated ?? 0} authenticated
              </span>
            </div>
            {analytics && analytics.totalResponses > 0 && (
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-chart-1 transition-all duration-700"
                  style={{ width: `${anonPercent}%` }}
                />
                <div
                  className="bg-chart-3 transition-all duration-700"
                  style={{ width: `${authPercent}%` }}
                />
              </div>
            )}
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-3">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ActivityIcon className="size-4" weight="bold" />
              Peak activity
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {peakTime ?? <span className="text-base font-normal text-muted-foreground">N/A</span>}
            </p>
            {analytics?.engagement.uniqueRespondents !== undefined && (
              <p className="mt-4 text-xs text-muted-foreground">
                {analytics.engagement.uniqueRespondents} unique respondents
              </p>
            )}
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" weight="bold" />
              Duration
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {analytics?.pollHealth.pollDuration ?? '-'}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {formatHoursAgo(analytics?.pollHealth.pollDurationHours ?? 0)}
            </p>
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendDown className="size-4" weight="bold" />
              Drop-off
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {dropOff === null ? (
                <span className="text-base font-normal text-muted-foreground">N/A</span>
              ) : (
                <>
                  {dropOff}
                  <span className="ml-0.5 text-base font-normal text-muted-foreground">%</span>
                </>
              )}
            </p>
            {dropOff !== null && (
              <p className="mt-4 text-xs text-muted-foreground">Q1 → Q{totalQuestions}</p>
            )}
          </div>
        </div>
      </section>

      {analytics?.timeline && analytics.timeline.length > 0 && (
        <section className="mb-16">
          <div className="rounded-2xl border border-border/40 bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Responses over time
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Daily response volume</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="size-3" weight="bold" />
                {analytics.timeline.reduce((s, e) => s + e.count, 0)} total
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart
                  data={analytics.timeline}
                  margin={{ bottom: 0, left: -20, right: 4, top: 4 }}
                >
                  <defs>
                    <linearGradient id="timelineFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    dy={10}
                    tick={{
                      fill: 'currentColor',
                      fontSize: 12,
                      opacity: 0.4,
                    }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    dx={-10}
                    tick={{
                      fill: 'currentColor',
                      fontSize: 12,
                      opacity: 0.4,
                    }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '13px',
                    }}
                    cursor={{
                      stroke: 'var(--color-border)',
                      strokeOpacity: 0.6,
                    }}
                  />
                  <Area
                    dataKey="count"
                    fill="url(#timelineFill)"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {analytics?.questionSummaries && analytics.questionSummaries.length > 0 && (
        <section>
          <h2 className="mb-8 font-heading text-lg font-semibold text-foreground">
            Question breakdown
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {analytics.questionSummaries.map((summary, idx) => {
              const winner = summary.options.reduce((a, b) => (a.count > b.count ? a : b));
              const winnerPercent =
                summary.totalAnswers > 0
                  ? Math.round((winner.count / summary.totalAnswers) * 100)
                  : 0;

              const isLastOdd =
                idx === analytics.questionSummaries.length - 1 &&
                analytics.questionSummaries.length % 2 === 1;

              return (
                <div
                  className={`rounded-2xl border border-border/40 bg-card p-8 ${
                    isLastOdd ? 'lg:col-span-2' : ''
                  }`}
                  key={summary.questionId}
                >
                  <div className="mb-6">
                    <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
                      {summary.questionText}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" weight="bold" />
                        {summary.totalAnswers} answers
                      </span>
                      <span className="text-muted-foreground/30">/</span>
                      <span>
                        {winner.option} leading at {winnerPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer height="100%" width="100%">
                      <BarChart
                        data={summary.options}
                        margin={{
                          bottom: 0,
                          left: -20,
                          right: 8,
                          top: 8,
                        }}
                      >
                        <CartesianGrid
                          horizontal={true}
                          stroke="var(--color-border)"
                          strokeDasharray="3 3"
                          strokeOpacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          axisLine={false}
                          dataKey="option"
                          dy={10}
                          tick={{
                            fill: 'currentColor',
                            fontSize: 12,
                            opacity: 0.5,
                          }}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          dx={-10}
                          tick={{
                            fill: 'currentColor',
                            fontSize: 12,
                            opacity: 0.5,
                          }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '13px',
                          }}
                          cursor={{
                            fill: 'var(--color-chart-1)',
                            opacity: 0.05,
                          }}
                        />
                        <Bar dataKey="count" maxBarSize={48} radius={[4, 4, 0, 0]}>
                          {summary.options.map((_, i) => (
                            <Cell fill={CHART_COLORS[i % CHART_COLORS.length]} key={i} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
